import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authorize, loadCafeAccess, verifyCafeAccess, createAuditLog } from '../middleware/auth.js';
import { sanitizeString, validateAmount } from '../utils/validation.js';
import { prisma } from '../lib/prisma.js';

export const ownerRouter = Router();

// Owner routes require CAFE_OWNER role + load their cafe access
ownerRouter.use(authorize('CAFE_OWNER'));
ownerRouter.use(loadCafeAccess);

// ============================================================
// GET /api/owner/dashboard
// ============================================================

ownerRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    if (!req.cafeIds || req.cafeIds.length === 0) {
      return res.json({ stats: {}, cafes: [] });
    }

    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [cafes, todayStats, weekPurchases, totalCustomers] = await Promise.all([
      prisma.cafe.findMany({
        where: { id: { in: req.cafeIds } },
        include: {
          branches: { where: { isActive: true } },
          staff: {
            where: { isActive: true },
            include: { user: { select: { name: true, phone: true } } }
          },
          _count: { select: { purchases: true } }
        }
      }),
      prisma.purchase.aggregate({
        _sum: { amount: true, pointsEarned: true },
        _count: true,
        where: {
          cafeId: { in: req.cafeIds },
          createdAt: { gte: today }
        }
      }),
      prisma.purchase.findMany({
        where: {
          cafeId: { in: req.cafeIds },
          createdAt: { gte: weekAgo }
        },
        select: { amount: true, createdAt: true }
      }),
      prisma.customerProfile.count({
        where: {
          loyaltyTransactions: {
            some: { cafeId: { in: req.cafeIds } }
          }
        }
      })
    ]);

    // Group weekly data by day
    const weeklyData: { [key: string]: { visits: number; revenue: number } } = {};
    const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = days[date.getDay()];
      weeklyData[key] = { visits: 0, revenue: 0 };
    }
    for (const p of weekPurchases) {
      const dayKey = days[new Date(p.createdAt).getDay()];
      if (weeklyData[dayKey]) {
        weeklyData[dayKey].visits++;
        weeklyData[dayKey].revenue += p.amount;
      }
    }

    // Recent purchases
    const recentPurchases = await prisma.purchase.findMany({
      where: { cafeId: { in: req.cafeIds } },
      include: {
        customer: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      stats: {
        todayVisits: todayStats._count,
        todayRevenue: todayStats._sum.amount || 0,
        todayPoints: todayStats._sum.pointsEarned || 0,
        totalCustomers,
        weeklyData: Object.entries(weeklyData).map(([day, data]) => ({ day, ...data }))
      },
      cafes,
      recentPurchases
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ============================================================
// GET /api/owner/customers
// ============================================================

ownerRouter.get('/customers', async (req: Request, res: Response) => {
  try {
    if (!req.cafeIds?.length) return res.json({ customers: [] });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // Get customers who have transactions at this owner's cafes
    const transactions = await prisma.loyaltyTransaction.findMany({
      where: { cafeId: { in: req.cafeIds } },
      select: { customerId: true },
      distinct: ['customerId']
    });

    const customerIds = transactions.map(t => t.customerId);

    const [customers, total] = await Promise.all([
      prisma.customerProfile.findMany({
        where: { id: { in: customerIds } },
        include: {
          user: { select: { name: true, phone: true } }
        },
        orderBy: { totalVisits: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.customerProfile.count({ where: { id: { in: customerIds } } })
    ]);

    res.json({ customers, pagination: { page, limit, total } });
  } catch (error) {
    console.error('Owner customers error:', error);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ============================================================
// GET /api/owner/transactions
// ============================================================

ownerRouter.get('/transactions', async (req: Request, res: Response) => {
  try {
    if (!req.cafeIds?.length) return res.json({ transactions: [] });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const [transactions, total] = await Promise.all([
      prisma.loyaltyTransaction.findMany({
        where: { cafeId: { in: req.cafeIds } },
        include: {
          customer: { include: { user: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.loyaltyTransaction.count({ where: { cafeId: { in: req.cafeIds } } })
    ]);

    res.json({ transactions, pagination: { page, limit, total } });
  } catch (error) {
    console.error('Owner transactions error:', error);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ============================================================
// POST /api/owner/rewards
// ============================================================

const createRewardSchema = z.object({
  cafeId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  pointsCost: z.number().int().min(1),
  type: z.enum(['DISCOUNT', 'FREE_ITEM', 'GIFT']),
  value: z.number().int().optional()
});

ownerRouter.post('/rewards', async (req: Request, res: Response) => {
  try {
    const result = createRewardSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Ma\'lumotlar noto\'g\'ri', details: result.error.errors });
    }

    const data = result.data;

    // Verify cafe access
    if (!req.cafeIds?.includes(data.cafeId)) {
      return res.status(403).json({ error: 'Sizda bu kafega kirish huquqi yo\'q' });
    }

    const reward = await prisma.reward.create({
      data: {
        cafeId: data.cafeId,
        name: sanitizeString(data.name),
        description: data.description ? sanitizeString(data.description) : null,
        pointsCost: data.pointsCost,
        type: data.type,
        value: data.value
      }
    });

    await createAuditLog(req.userId!, 'reward.created', 'Reward', reward.id, data, req.ip || undefined);

    res.status(201).json({ success: true, reward });
  } catch (error) {
    console.error('Create reward error:', error);
    res.status(500).json({ error: 'Sovg\'a yaratishda xatolik' });
  }
});

// ============================================================
// GET /api/owner/rewards
// ============================================================

ownerRouter.get('/rewards', async (req: Request, res: Response) => {
  try {
    if (!req.cafeIds?.length) return res.json({ rewards: [] });

    const rewards = await prisma.reward.findMany({
      where: { cafeId: { in: req.cafeIds } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ rewards });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ============================================================
// POST /api/owner/promotions
// ============================================================

const createPromotionSchema = z.object({
  cafeId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['DOUBLE_POINTS', 'DISCOUNT', 'FREE_ITEM', 'SPECIAL']),
  multiplier: z.number().optional(),
  discountPercent: z.number().int().min(1).max(100).optional(),
  startDate: z.string(),
  endDate: z.string()
});

ownerRouter.post('/promotions', async (req: Request, res: Response) => {
  try {
    const result = createPromotionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Ma\'lumotlar noto\'g\'ri', details: result.error.errors });
    }

    const data = result.data;

    if (!req.cafeIds?.includes(data.cafeId)) {
      return res.status(403).json({ error: 'Sizda bu kafega kirish huquqi yo\'q' });
    }

    const promotion = await prisma.promotion.create({
      data: {
        cafeId: data.cafeId,
        title: sanitizeString(data.title),
        description: data.description ? sanitizeString(data.description) : null,
        type: data.type,
        multiplier: data.multiplier,
        discountPercent: data.discountPercent,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      }
    });

    await createAuditLog(req.userId!, 'promotion.created', 'Promotion', promotion.id, data, req.ip || undefined);

    res.status(201).json({ success: true, promotion });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ error: 'Aksiya yaratishda xatolik' });
  }
});

// ============================================================
// GET /api/owner/promotions
// ============================================================

ownerRouter.get('/promotions', async (req: Request, res: Response) => {
  try {
    if (!req.cafeIds?.length) return res.json({ promotions: [] });

    const promotions = await prisma.promotion.findMany({
      where: { cafeId: { in: req.cafeIds } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ promotions });
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ============================================================
// GET /api/owner/analytics
// ============================================================

ownerRouter.get('/analytics', async (req: Request, res: Response) => {
  try {
    if (!req.cafeIds?.length) return res.json({});

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [purchases, loyaltyStats, popularItems] = await Promise.all([
      prisma.purchase.findMany({
        where: {
          cafeId: { in: req.cafeIds },
          createdAt: { gte: last30Days }
        }
      }),
      prisma.loyaltyTransaction.aggregate({
        _sum: { points: true },
        _count: true,
        where: {
          cafeId: { in: req.cafeIds },
          createdAt: { gte: last30Days }
        }
      }),
      prisma.purchase.findMany({
        where: {
          cafeId: { in: req.cafeIds },
          createdAt: { gte: last30Days }
        },
        select: { itemsJson: true }
      })
    ]);

    // Parse popular items
    const itemCounts: { [key: string]: number } = {};
    for (const p of popularItems) {
      try {
        const items = JSON.parse(p.itemsJson);
        for (const item of items) {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        }
      } catch {}
    }
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
    const avgCheck = purchases.length > 0 ? Math.round(totalRevenue / purchases.length) : 0;

    res.json({
      last30Days: {
        totalRevenue,
        totalPurchases: purchases.length,
        avgCheck,
        totalLoyaltyPoints: loyaltyStats._sum.points || 0,
        loyaltyTransactions: loyaltyStats._count,
        topItems
      }
    });
  } catch (error) {
    console.error('Owner analytics error:', error);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ============================================================
// POST /api/owner/branches
// ============================================================

ownerRouter.post('/branches', async (req: Request, res: Response) => {
  try {
    const { cafeId, name, address, phone } = req.body;

    if (!req.cafeIds?.includes(cafeId)) {
      return res.status(403).json({ error: 'Sizda bu kafega kirish huquqi yo\'q' });
    }

    const branch = await prisma.cafeBranch.create({
      data: {
        cafeId,
        name: sanitizeString(name),
        address: sanitizeString(address),
        phone: phone || null
      }
    });

    await createAuditLog(req.userId!, 'branch.created', 'CafeBranch', branch.id, { cafeId }, req.ip || undefined);

    res.status(201).json({ success: true, branch });
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Filial yaratishda xatolik' });
  }
});

// ============================================================
// POST /api/owner/employees
// ============================================================

ownerRouter.post('/employees', async (req: Request, res: Response) => {
  try {
    const { cafeId, branchId, employeePhone, employeeName } = req.body;

    if (!req.cafeIds?.includes(cafeId)) {
      return res.status(403).json({ error: 'Sizda bu kafega kirish huquqi yo\'q' });
    }

    // Find or create employee user
    let user = await prisma.user.findUnique({ where: { phone: employeePhone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: employeePhone,
          name: employeeName || 'Xodim',
          role: 'CAFE_EMPLOYEE'
        }
      });
    } else if (user.role === 'CUSTOMER') {
      // Update role to employee
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'CAFE_EMPLOYEE' }
      });
    }

    // Create staff assignment
    const staff = await prisma.cafeStaff.create({
      data: {
        userId: user.id,
        cafeId,
        branchId: branchId || null,
        role: 'CAFE_EMPLOYEE'
      }
    });

    await createAuditLog(req.userId!, 'employee.created', 'CafeStaff', staff.id, { cafeId, employeePhone }, req.ip || undefined);

    res.status(201).json({ success: true, staff });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Bu xodim allaqachon qo\'shilgan' });
    }
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Xodim qo\'shishda xatolik' });
  }
});

// ============================================================
// GET /api/owner/employees
// ============================================================

ownerRouter.get('/employees', async (req: Request, res: Response) => {
  try {
    if (!req.cafeIds?.length) return res.json({ employees: [] });

    const employees = await prisma.cafeStaff.findMany({
      where: {
        cafeId: { in: req.cafeIds },
        role: 'CAFE_EMPLOYEE'
      },
      include: {
        user: { select: { name: true, phone: true } },
        branch: { select: { name: true } }
      }
    });

    res.json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

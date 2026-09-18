import type { Cafe, Customer, Order, LoyaltyTransaction, Reward, Promotion, AnalyticsData, Branch } from '../types';

// Seed data for pilot cafés in Namangan
export const PILOT_CAFES: Cafe[] = [
  {
    id: 'cafe-1',
    ownerId: 'owner-1',
    name: 'Artel Coffee',
    description: 'Zamonaviy kofe va desertlar. Namangan markazida eng yaxshi espresso.',
    address: 'Navoiy ko\'chasi, 45',
    city: 'Namangan',
    phone: '+998 69 222 33 44',
    workingHours: '08:00 — 22:00',
    loyaltyRate: 5, // 5 points per 1000 UZS
    isActive: true,
    createdAt: '2025-01-15T00:00:00Z',
    branches: [
      { id: 'branch-1a', cafeId: 'cafe-1', name: 'Markaziy filial', address: 'Navoiy ko\'chasi, 45', isActive: true },
      { id: 'branch-1b', cafeId: 'cafe-1', name: 'Kosonsoy filial', address: 'Kosonsoy ko\'chasi, 12', isActive: true },
    ]
  },
  {
    id: 'cafe-2',
    ownerId: 'owner-2',
    name: 'Bukhara Coffee House',
    description: 'An\'anaviy va zamonaviy kofe madaniyati. Oilaviy muhit.',
    address: 'Mustaqillik shoh ko\'chasi, 88',
    city: 'Namangan',
    phone: '+998 69 222 55 66',
    workingHours: '07:00 — 23:00',
    loyaltyRate: 3,
    isActive: true,
    createdAt: '2025-02-01T00:00:00Z',
    branches: [
      { id: 'branch-2a', cafeId: 'cafe-2', name: 'Asosiy', address: 'Mustaqillik shoh ko\'chasi, 88', isActive: true },
    ]
  },
  {
    id: 'cafe-3',
    ownerId: 'owner-3',
    name: 'Latte Art Café',
    description: 'Professional baristalar. Har bir stakan — san\'at asari.',
    address: 'Amir Temur ko\'chasi, 23',
    city: 'Namangan',
    phone: '+998 69 222 77 88',
    workingHours: '09:00 — 21:00',
    loyaltyRate: 4,
    isActive: true,
    createdAt: '2025-03-10T00:00:00Z',
    branches: [
      { id: 'branch-3a', cafeId: 'cafe-3', name: 'Markaziy', address: 'Amir Temur ko\'chasi, 23', isActive: true },
    ]
  },
  {
    id: 'cafe-4',
    ownerId: 'owner-1',
    name: 'Green Bean',
    description: 'Organik kofe va tabiiy desertlar. Salomatligingiz uchun.',
    address: 'Yangibozor ko\'chasi, 5',
    city: 'Namangan',
    phone: '+998 69 222 99 00',
    workingHours: '08:00 — 20:00',
    loyaltyRate: 6,
    isActive: true,
    createdAt: '2025-04-01T00:00:00Z',
    branches: [
      { id: 'branch-4a', cafeId: 'cafe-4', name: 'Asosiy', address: 'Yangibozor ko\'chasi, 5', isActive: true },
    ]
  }
];

export const PILOT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    userId: 'user-1',
    name: 'Sardor Karimov',
    phone: '+998 91 234 56 78',
    totalPoints: 1250,
    totalVisits: 34,
    totalSpent: 2850000,
    favoriteCafes: ['cafe-1', 'cafe-3'],
    joinedAt: '2025-01-20T00:00:00Z',
    level: 'gold'
  },
  {
    id: 'cust-2',
    userId: 'user-2',
    name: 'Nilufar Rashidova',
    phone: '+998 93 345 67 89',
    totalPoints: 890,
    totalVisits: 22,
    totalSpent: 1920000,
    favoriteCafes: ['cafe-2'],
    joinedAt: '2025-02-05T00:00:00Z',
    level: 'silver'
  },
  {
    id: 'cust-3',
    userId: 'user-3',
    name: 'Bobur Aliyev',
    phone: '+998 94 456 78 90',
    totalPoints: 2100,
    totalVisits: 48,
    totalSpent: 4200000,
    favoriteCafes: ['cafe-1', 'cafe-4'],
    joinedAt: '2025-01-15T00:00:00Z',
    level: 'platinum'
  },
  {
    id: 'cust-4',
    userId: 'user-4',
    name: 'Malika Yusupova',
    phone: '+998 97 567 89 01',
    totalPoints: 450,
    totalVisits: 12,
    totalSpent: 890000,
    favoriteCafes: ['cafe-3'],
    joinedAt: '2025-03-15T00:00:00Z',
    level: 'bronze'
  },
  {
    id: 'cust-5',
    userId: 'user-5',
    name: 'Jasur Toshmatov',
    phone: '+998 90 678 90 12',
    totalPoints: 1680,
    totalVisits: 38,
    totalSpent: 3150000,
    favoriteCafes: ['cafe-1', 'cafe-2', 'cafe-4'],
    joinedAt: '2025-01-25T00:00:00Z',
    level: 'gold'
  }
];

export const PILOT_ORDERS: Order[] = [
  {
    id: 'order-1',
    customerId: 'cust-1',
    cafeId: 'cafe-1',
    branchId: 'branch-1a',
    amount: 45000,
    pointsEarned: 225,
    items: [
      { name: 'Cappuccino', quantity: 1, price: 25000 },
      { name: 'Cheesecake', quantity: 1, price: 20000 }
    ],
    createdAt: '2025-06-14T10:30:00Z'
  },
  {
    id: 'order-2',
    customerId: 'cust-3',
    cafeId: 'cafe-1',
    branchId: 'branch-1a',
    amount: 62000,
    pointsEarned: 310,
    items: [
      { name: 'Latte', quantity: 2, price: 25000 },
      { name: 'Croissant', quantity: 1, price: 12000 }
    ],
    createdAt: '2025-06-14T11:15:00Z'
  },
  {
    id: 'order-3',
    customerId: 'cust-2',
    cafeId: 'cafe-2',
    branchId: 'branch-2a',
    amount: 35000,
    pointsEarned: 105,
    items: [
      { name: 'Americano', quantity: 1, price: 18000 },
      { name: 'Tiramisu', quantity: 1, price: 17000 }
    ],
    createdAt: '2025-06-14T14:00:00Z'
  },
  {
    id: 'order-4',
    customerId: 'cust-5',
    cafeId: 'cafe-4',
    branchId: 'branch-4a',
    amount: 78000,
    pointsEarned: 468,
    items: [
      { name: 'Flat White', quantity: 1, price: 28000 },
      { name: 'Matcha Latte', quantity: 1, price: 30000 },
      { name: 'Brownie', quantity: 2, price: 10000 }
    ],
    createdAt: '2025-06-14T15:45:00Z'
  },
  {
    id: 'order-5',
    customerId: 'cust-4',
    cafeId: 'cafe-3',
    branchId: 'branch-3a',
    amount: 52000,
    pointsEarned: 208,
    items: [
      { name: 'Espresso', quantity: 2, price: 16000 },
      { name: 'Waffle', quantity: 1, price: 20000 }
    ],
    createdAt: '2025-06-14T16:20:00Z'
  }
];

export const PILOT_REWARDS: Reward[] = [
  {
    id: 'reward-1',
    cafeId: 'cafe-1',
    name: 'Bepul Cappuccino',
    description: 'Har qanday cappuccino bepul',
    pointsCost: 500,
    type: 'free_item',
    isActive: true,
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'reward-2',
    cafeId: 'cafe-1',
    name: '20% chegirma',
    description: 'Keyingi buyurtmangizga 20% chegirma',
    pointsCost: 300,
    type: 'discount',
    value: 20,
    isActive: true,
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'reward-3',
    cafeId: 'cafe-2',
    name: 'Bepul desert',
    description: 'Tanlangan desertlardan biri bepul',
    pointsCost: 400,
    type: 'free_item',
    isActive: true,
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 'reward-4',
    cafeId: 'cafe-3',
    name: 'Latte Art sovg\'asi',
    description: 'Maxsus latte art bilan latte',
    pointsCost: 600,
    type: 'gift',
    isActive: true,
    createdAt: '2025-03-10T00:00:00Z'
  },
  {
    id: 'reward-5',
    cafeId: 'cafe-4',
    name: '15% chegirma',
    description: 'Barcha mahsulotlarga 15% chegirma',
    pointsCost: 350,
    type: 'discount',
    value: 15,
    isActive: true,
    createdAt: '2025-04-01T00:00:00Z'
  }
];

export const PILOT_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    cafeId: 'cafe-1',
    title: 'Ikki barobar ball!',
    description: 'Bu hafta barcha xaridlardan ikki barobar ball oling',
    type: 'double_points',
    multiplier: 2,
    startDate: '2025-06-10T00:00:00Z',
    endDate: '2025-06-20T23:59:59Z',
    isActive: true
  },
  {
    id: 'promo-2',
    cafeId: 'cafe-3',
    title: 'Ertalabki maxsus taklif',
    description: 'Soat 9:00 dan 11:00 gacha 10% chegirma',
    type: 'discount',
    discountPercent: 10,
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-06-30T23:59:59Z',
    isActive: true
  }
];

export const PILOT_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [
  {
    id: 'lt-1',
    customerId: 'cust-1',
    cafeId: 'cafe-1',
    branchId: 'branch-1a',
    type: 'earn',
    points: 225,
    description: 'Cappuccino + Cheesecake xaridi',
    orderId: 'order-1',
    createdAt: '2025-06-14T10:30:00Z'
  },
  {
    id: 'lt-2',
    customerId: 'cust-3',
    cafeId: 'cafe-1',
    branchId: 'branch-1a',
    type: 'earn',
    points: 310,
    description: 'Latte x2 + Croissant xaridi',
    orderId: 'order-2',
    createdAt: '2025-06-14T11:15:00Z'
  },
  {
    id: 'lt-3',
    customerId: 'cust-1',
    cafeId: 'cafe-1',
    branchId: 'branch-1a',
    type: 'redeem',
    points: -500,
    description: 'Bepul Cappuccino sovug\'i',
    rewardId: 'reward-1',
    createdAt: '2025-06-12T14:00:00Z'
  },
  {
    id: 'lt-4',
    customerId: 'cust-5',
    cafeId: 'cafe-4',
    branchId: 'branch-4a',
    type: 'earn',
    points: 468,
    description: 'Flat White + Matcha Latte + Brownie x2',
    orderId: 'order-4',
    createdAt: '2025-06-14T15:45:00Z'
  }
];

// Analytics generator
export function generateAnalytics(cafeId: string): AnalyticsData {
  const cafeOrders = PILOT_ORDERS.filter(o => o.cafeId === cafeId);
  const todayOrders = cafeOrders.filter(o => o.createdAt.startsWith('2025-06-14'));
  
  return {
    todayVisits: todayOrders.length || 12,
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.amount, 0) || 485000,
    totalCustomers: PILOT_CUSTOMERS.filter(c => c.favoriteCafes.includes(cafeId)).length || 45,
    totalOrders: cafeOrders.length || 156,
    weeklyData: [
      { day: 'Dush', visits: 18, revenue: 890000 },
      { day: 'Sesh', visits: 22, revenue: 1050000 },
      { day: 'Chor', visits: 15, revenue: 720000 },
      { day: 'Pay', visits: 28, revenue: 1340000 },
      { day: 'Jum', visits: 35, revenue: 1680000 },
      { day: 'Shan', visits: 42, revenue: 2100000 },
      { day: 'Yak', visits: 38, revenue: 1890000 },
    ],
    topCustomers: [
      { name: 'Bobur Aliyev', visits: 48, spent: 4200000 },
      { name: 'Sardor Karimov', visits: 34, spent: 2850000 },
      { name: 'Jasur Toshmatov', visits: 38, spent: 3150000 },
      { name: 'Nilufar Rashidova', visits: 22, spent: 1920000 },
      { name: 'Malika Yusupova', visits: 12, spent: 890000 },
    ],
    popularItems: [
      { name: 'Cappuccino', count: 89 },
      { name: 'Latte', count: 76 },
      { name: 'Americano', count: 54 },
      { name: 'Cheesecake', count: 43 },
      { name: 'Croissant', count: 38 },
    ]
  };
}

// Format currency
export function formatUZS(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
}

// Format short currency
export function formatShortUZS(amount: number): string {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M so\'m';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K so\'m';
  }
  return amount + ' so\'m';
}

// Get level color
export function getLevelColor(level: string): string {
  switch (level) {
    case 'bronze': return '#cd7f32';
    case 'silver': return '#94a3b8';
    case 'gold': return '#d4a017';
    case 'platinum': return '#7c3aed';
    default: return '#6b7280';
  }
}

// Get level name in Uzbek
export function getLevelName(level: string): string {
  switch (level) {
    case 'bronze': return 'Bronza';
    case 'silver': return 'Kumush';
    case 'gold': return 'Oltin';
    case 'platinum': return 'Platina';
    default: return '';
  }
}

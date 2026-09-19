/**
 * Development seed script - creates test accounts for manual testing
 * 
 * Usage: npx tsx server/scripts/seed-dev.ts
 * 
 * WARNING: This script should ONLY be used in development environment.
 * It creates test accounts with known credentials for testing purposes.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Test accounts configuration
const TEST_ACCOUNTS = [
  {
    phone: '+998901111111',
    name: 'Test Admin',
    role: 'PLATFORM_ADMIN' as const,
    description: 'Platform administrator - can manage all cafés'
  },
  {
    phone: '+998902222222',
    name: 'Test Owner',
    role: 'CAFE_OWNER' as const,
    description: 'Café owner - manages Artel Coffee',
    cafe: {
      name: 'Artel Coffee',
      address: 'Navoiy ko\'chasi, 45',
      city: 'Namangan',
      phone: '+998692223344',
      loyaltyRate: 5
    }
  },
  {
    phone: '+998903333333',
    name: 'Test Employee',
    role: 'CAFE_EMPLOYEE' as const,
    description: 'Café employee - processes purchases'
  },
  {
    phone: '+998904444444',
    name: 'Test Customer',
    role: 'CUSTOMER' as const,
    description: 'Regular customer - earns loyalty points'
  }
];

async function seed() {
  console.log('🌱 Starting development seed...\n');

  // Check if we're in development
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ ERROR: Seed script cannot run in production!');
    process.exit(1);
  }

  try {
    // Clean up existing test data (optional - comment out if you want to preserve data)
    console.log('🧹 Cleaning up existing test accounts...');
    
    for (const account of TEST_ACCOUNTS) {
      const existingUser = await prisma.user.findUnique({
        where: { phone: account.phone }
      });

      if (existingUser) {
        // Delete related data
        await prisma.cafeStaff.deleteMany({ where: { userId: existingUser.id } });
        await prisma.customerProfile.deleteMany({ where: { userId: existingUser.id } });
        await prisma.session.deleteMany({ where: { userId: existingUser.id } });
        await prisma.user.delete({ where: { id: existingUser.id } });
        console.log(`  ✓ Deleted existing user: ${account.phone}`);
      }
    }

    // Create test accounts
    console.log('\n👥 Creating test accounts...\n');

    for (const account of TEST_ACCOUNTS) {
      console.log(`Creating ${account.role}: ${account.name} (${account.phone})`);

      // Create user
      const user = await prisma.user.create({
         {
          phone: account.phone,
          name: account.name,
          role: account.role
        }
      });

      // Create role-specific data
      if (account.role === 'CUSTOMER') {
        await prisma.customerProfile.create({
           {
            userId: user.id,
            totalPoints: 500,
            totalVisits: 10,
            totalSpent: 250000,
            level: 'SILVER'
          }
        });
        console.log(`  ✓ Created customer profile with 500 points`);
      }

      if (account.role === 'CAFE_OWNER' && account.cafe) {
        // Create café
        const cafe = await prisma.cafe.create({
           {
            name: account.cafe.name,
            address: account.cafe.address,
            city: account.cafe.city,
            phone: account.cafe.phone,
            loyaltyRate: account.cafe.loyaltyRate,
            status: 'ACTIVE'
          }
        });

        // Create branch
        await prisma.cafeBranch.create({
           {
            cafeId: cafe.id,
            name: 'Markaziy filial',
            address: account.cafe.address
          }
        });

        // Assign owner to café
        await prisma.cafeStaff.create({
           {
            userId: user.id,
            cafeId: cafe.id,
            role: 'CAFE_OWNER'
          }
        });

        console.log(`  ✓ Created café: ${cafe.name}`);
        console.log(`  ✓ Assigned as owner`);

        // Create some test rewards
        await prisma.reward.createMany({
           [
            {
              cafeId: cafe.id,
              name: 'Bepul Cappuccino',
              description: 'Har qanday cappuccino bepul',
              pointsCost: 500,
              type: 'FREE_ITEM'
            },
            {
              cafeId: cafe.id,
              name: '20% chegirma',
              description: 'Keyingi buyurtmangizga 20% chegirma',
              pointsCost: 300,
              type: 'DISCOUNT',
              value: 20
            }
          ]
        });
        console.log(`  ✓ Created test rewards`);
      }

      if (account.role === 'CAFE_EMPLOYEE') {
        // Find the café created by owner
        const ownerUser = await prisma.user.findUnique({
          where: { phone: '+998902222222' },
          include: { cafeStaff: true }
        });

        if (ownerUser && ownerUser.cafeStaff.length > 0) {
          const cafeId = ownerUser.cafeStaff[0].cafeId;
          
          await prisma.cafeStaff.create({
             {
              userId: user.id,
              cafeId: cafeId,
              role: 'CAFE_EMPLOYEE'
            }
          });
          console.log(`  ✓ Assigned to café as employee`);
        }
      }

      console.log(`  ✓ ${account.description}\n`);
    }

    console.log('✅ Seed completed successfully!\n');
    console.log('📝 Test accounts:');
    console.log('  Admin:    +998901111111');
    console.log('  Owner:    +998902222222');
    console.log('  Employee: +998903333333');
    console.log('  Customer: +998904444444');
    console.log('\n⚠️  Use these numbers with OTP code from console in dev mode.\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

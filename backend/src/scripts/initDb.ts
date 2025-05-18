import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from '../config';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@afriqhome.com' },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@afriqhome.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        is_verified: true
      },
    });

    console.log('Admin user created:', adminUser);

    // Create test properties
    const properties = await Promise.all([
      prisma.property.create({
        data: {
          title: 'Luxury Villa',
          description: 'Beautiful luxury villa with ocean view',
          price: 500000,
          location: 'Lagos, Nigeria',
          type: 'RESIDENTIAL',
          status: 'AVAILABLE',
          userId: adminUser.id,
          features: ['Swimming Pool', 'Garden', 'Security'],
          images: ['villa1.jpg', 'villa2.jpg']
        }
      }),
      prisma.property.create({
        data: {
          title: 'Modern Apartment',
          description: 'Contemporary apartment in city center',
          price: 250000,
          location: 'Nairobi, Kenya',
          type: 'RESIDENTIAL',
          status: 'AVAILABLE',
          userId: adminUser.id,
          features: ['Parking', 'Gym', '24/7 Security'],
          images: ['apartment1.jpg', 'apartment2.jpg']
        }
      })
    ]);

    console.log('Test properties created:', properties);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Only run in development
if (config.env === 'development') {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else {
  console.log('Skipping database initialization in production');
} 
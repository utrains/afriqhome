import { PrismaClient } from '@prisma/client';
import { config } from './index';

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient({
  log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: config.database.url,
    },
  },
});

// Handle process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma; 
// Set JWT_SECRET at the very top, before any imports
process.env.JWT_SECRET = 'test_secret_key';
process.env.NODE_ENV = 'test';

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Function to clean up the database
async function cleanupDatabase() {
  try {
    // Delete in order to respect foreign key constraints
    await prisma.shopListItem.deleteMany();
    await prisma.shopList.deleteMany();
    await prisma.item.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error cleaning up database:', error);
    throw error;
  }
}

// Global setup - runs once before all tests
beforeAll(async () => {
  await cleanupDatabase();
});

// Global teardown - runs once after all tests
afterAll(async () => {
  await cleanupDatabase();
  await prisma.$disconnect();
});

// Clean up before each test instead of after
beforeEach(async () => {
  await cleanupDatabase();
}); 
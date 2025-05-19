console.log(require.resolve('@prisma/client'))

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Global setup - runs once before all tests
beforeAll(async () => {
  // Clean up the database before running tests
  await prisma.shopListItem.deleteMany();
  await prisma.shopList.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
});

// Global teardown - runs once after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Clean up after each test
afterEach(async () => {
  await prisma.shopListItem.deleteMany();
  await prisma.shopList.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
}); 
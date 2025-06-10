import express from 'express';
import prisma from '../lib/prisma.js';
import { validateItem } from '../middleware/itemValidation.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all items for a user
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const { 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      tag,
      search,
      expired
    } = req.query;

    const where = {
      userId: req.user.id,
      ...(tag && { tag }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(expired === 'true' && { expiredDate: { lt: new Date() } }),
      ...(expired === 'false' && { expiredDate: { gt: new Date() } })
    };

    const items = await prisma.item.findMany({
      where: {
        userId: userId
      },
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        quantity: true,
        expiredDate: true,
        tag: true,
        createdAt: true
      }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new item
// what does auth do?
router.post('/', auth, validateItem, async (req, res) => {
  try {
    const { name, quantity, expiredDate, tag } = req.body;
    
    const item = await prisma.item.create({
      data: {
        name,
        quantity,
        expiredDate,
        tag,
        userId: req.user.id
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        expiredDate: true,
        tag: true,
        createdAt: true
      }
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update item
//why use put, not patch?
router.put('/:id', auth, validateItem, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, expiredDate, tag } = req.body;

    // Check item ownership
    const existingItem = await prisma.item.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: { name, quantity, expiredDate, tag },
      select: {
        id: true,
        name: true,
        quantity: true,
        expiredDate: true,
        tag: true,
        createdAt: true
      }
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check item ownership
    const item = await prisma.item.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await prisma.item.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

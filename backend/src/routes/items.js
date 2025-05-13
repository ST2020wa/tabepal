import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Get all items for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const items = await prisma.item.findMany({
      where: { 
        userId: parseInt(userId)
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

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, expiredDate, tag, userId } = req.body;
    
    const item = await prisma.item.create({
      data: {
        name,
        quantity,
        expiredDate,
        tag,
        userId
      }
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update item name
//TODO: add update quantity, expiredDate, tag etc. logic
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'New name is required' });
    }

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: { name },
      select: {
        id: true,
        name: true,
        quantity: true,
        expiredDate: true,
        tag: true,
        createdAt: true
      }
    });

    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) }
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

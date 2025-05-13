import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, userId } = req.body;
    
    const shoplist = await prisma.shopList.create({
      data: {
        name,
        userId
      }
    });
    
    res.status(201).json(shoplist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const shoplists = await prisma.shopList.findMany({
      where: { userId: parseInt(userId) }
    }); 

    res.json(shoplists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update shoplist name
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'New name is required' });
    }

    const shoplist = await prisma.shopList.findUnique({
      where: { id: parseInt(id) }
    });

    if (!shoplist) {
      return res.status(404).json({ error: 'Shoplist not found' });
    }

    const updatedShoplist = await prisma.shopList.update({
      where: { id: parseInt(id) },
      data: { name },
      select: {
        id: true,
        name: true,
        createdAt: true,
        userId: true
      }
    });

    res.json({ message: 'Shoplist updated successfully', shoplist: updatedShoplist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete shoplist by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const shoplist = await prisma.shopList.findUnique({
      where: { id: parseInt(id) }
    });

    if (!shoplist) {
      return res.status(404).json({ error: 'Shoplist not found' });
    }

    await prisma.shopList.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Shoplist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
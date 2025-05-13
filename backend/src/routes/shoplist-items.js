import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, quantity, tag, shoplistId } = req.body;
    
    const shoplistItem = await prisma.shopListItem.create({
      data: {
        name,
        quantity,
        tag,
        shoplistId
      }
    });
    
    res.status(201).json(shoplistItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { shoplistId } = req.query;

    if (!shoplistId) {
      return res.status(400).json({ error: 'Shoplist ID is required' });
    }

    const shoplistItems = await prisma.shopListItem.findMany({
      where: { shoplistId: parseInt(shoplistId) }
    });

    res.json(shoplistItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required for update' });
    }

    const updatedItem = await prisma.shopListItem.update({
      where: { id: parseInt(id) },
      data: { name }
    });

    res.json(updatedItem);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Shoplist item not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.shopListItem.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Shoplist item deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Shoplist item not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router; 
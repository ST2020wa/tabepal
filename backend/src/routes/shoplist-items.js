import express from 'express';
import prisma from '../lib/prisma.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { name, quantity, tag, shoplistId } = req.body;
    if(!name.length){
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    
    // Check shoplist ownership
    const shoplist = await prisma.shopList.findFirst({
      where: { 
        id: parseInt(shoplistId),
        userId: req.user.id
      }
    });

    if (!shoplist) {
      return res.status(404).json({ error: 'Shoplist not found' });
    }
    
    const shoplistItem = await prisma.shopListItem.create({
      data: {
        name,
        quantity,
        tag,
        shoplistId: parseInt(shoplistId)
      }
    });
    
    res.status(201).json(shoplistItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { shoplistId } = req.query;

    if (!shoplistId) {
      return res.status(400).json({ error: 'Shoplist ID is required' });
    }

    // Check shoplist ownership
    const shoplist = await prisma.shopList.findFirst({
      where: { 
        id: parseInt(shoplistId),
        userId: req.user.id
      }
    });

    if (!shoplist) {
      return res.status(404).json({ error: 'Shoplist not found' });
    }

    const shoplistItems = await prisma.shopListItem.findMany({
      where: { shoplistId: parseInt(shoplistId) }
    });

    res.json(shoplistItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required for update' });
    }

    // Check shoplist item ownership through shoplist
    const shoplistItem = await prisma.shopListItem.findFirst({
      where: { 
        id: parseInt(id),
        shoplist: {
          userId: req.user.id
        }
      }
    });

    if (!shoplistItem) {
      return res.status(404).json({ error: 'Shoplist item not found' });
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

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check shoplist item ownership through shoplist
    const shoplistItem = await prisma.shopListItem.findFirst({
      where: { 
        id: parseInt(id),
        shoplist: {
          userId: req.user.id
        }
      }
    });

    if (!shoplistItem) {
      return res.status(404).json({ error: 'Shoplist item not found' });
    }

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
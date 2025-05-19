import express from 'express';
import prisma from '../lib/prisma.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if(!name.length){
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    
    const shoplist = await prisma.shopList.create({
      data: {
        name,
        userId: req.user.id
      }
    });
    
    res.status(201).json(shoplist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const shoplists = await prisma.shopList.findMany({
      where: { userId: req.user.id }
    }); 

    res.json(shoplists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update shoplist name
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'New name is required' });
    }

    // Check shoplist ownership
    const shoplist = await prisma.shopList.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id
      }
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
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check shoplist ownership
    const shoplist = await prisma.shopList.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id
      }
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
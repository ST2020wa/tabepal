import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Create a new shoplist item
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

export default router; 
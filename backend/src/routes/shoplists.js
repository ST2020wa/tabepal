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

export default router;
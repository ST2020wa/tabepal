import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth Middleware - Token:', token);
    console.log('Auth Middleware - JWT_SECRET:', process.env.JWT_SECRET);
    
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware - Decoded token:', decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    console.log('Auth Middleware - Found user:', user);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Middleware - Error:', error.message);
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 
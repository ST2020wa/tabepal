import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import itemRoutes from './routes/items.js';
import shoplistRoutes from './routes/shoplists.js';
import shoplistItemRoutes from './routes/shoplist-items.js';
import authRoutes from './routes/auth.js';
import { auth } from './middleware/auth.js';

dotenv.config();

// Verify JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tabepal API' });
});

// Auth routes
app.use('/api/auth', authRoutes);
// Protected routes
app.use('/api/users', auth, userRoutes);
app.use('/api/items', auth, itemRoutes);
app.use('/api/shoplists', auth, shoplistRoutes);
app.use('/api/shoplist-items', auth, shoplistItemRoutes);

const PORT = process.env.PORT || 4000;

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
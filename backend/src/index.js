import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import itemRoutes from './routes/items.js';
import shoplistRoutes from './routes/shoplists.js';
import shoplistItemRoutes from './routes/shoplist-items.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tabepal API' });
});

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/shoplists', shoplistRoutes);
app.use('/api/shoplist-items', shoplistItemRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
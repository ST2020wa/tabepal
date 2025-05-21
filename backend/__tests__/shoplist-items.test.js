import request from 'supertest';
import app from '../src/index.js';

describe('Shopping List Items Endpoints', () => {
  let authToken;
  let shoplistId;
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  };

  const testShoplistItem = {
    name: 'Test Item',
    quantity: 5,
    tag: 'test'
  };

  beforeEach(async () => {
    // Create a test user and get token
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    authToken = signupRes.body.token;

    // Create a test shopping list
    const shoplistRes = await request(app)
      .post('/api/shoplists')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Shopping List' });
    shoplistId = shoplistRes.body.id;
  });

  describe('POST /api/shoplist-items', () => {
    it('should add item to shopping list', async () => {
      const res = await request(app)
        .post('/api/shoplist-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testShoplistItem,
          shoplistId
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', testShoplistItem.name);
      expect(res.body).toHaveProperty('quantity', testShoplistItem.quantity);
      expect(res.body).toHaveProperty('tag', testShoplistItem.tag);
      expect(res.body).toHaveProperty('shoplistId', shoplistId);
    });

    it('should not add item without name', async () => {
      const res = await request(app)
        .post('/api/shoplist-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testShoplistItem,
          name: '',
          shoplistId
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not add item to non-existent shopping list', async () => {
      const res = await request(app)
        .post('/api/shoplist-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testShoplistItem,
          shoplistId: 99999
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/shoplist-items', () => {
    beforeEach(async () => {
      // Add some test items to the shopping list
      await request(app)
        .post('/api/shoplist-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testShoplistItem,
          shoplistId
        });

      await request(app)
        .post('/api/shoplist-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testShoplistItem,
          name: 'Test Item 2',
          shoplistId
        });
    });

    it('should get all items in shopping list', async () => {
      const res = await request(app)
        .get(`/api/shoplist-items?shoplistId=${shoplistId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should not get items without shoplistId', async () => {
      const res = await request(app)
        .get('/api/shoplist-items')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/shoplist-items/:id', () => {
    let itemId;

    beforeEach(async () => {
      // Add a test item to the shopping list
      const createRes = await request(app)
        .post('/api/shoplist-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testShoplistItem,
          shoplistId
        });
      itemId = createRes.body.id;
    });

    it('should update shopping list item', async () => {
      const updateData = {
        name: 'Updated Item'
      };

      const res = await request(app)
        .put(`/api/shoplist-items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', updateData.name);
    });

    it('should not update non-existent item', async () => {
      const res = await request(app)
        .put('/api/shoplist-items/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Item' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/shoplist-items/:id', () => {
    let itemId;

    beforeEach(async () => {
      // Add a test item to the shopping list
      const createRes = await request(app)
        .post('/api/shoplist-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testShoplistItem,
          shoplistId
        });
      itemId = createRes.body.id;
    });

    it('should delete shopping list item', async () => {
      const res = await request(app)
        .delete(`/api/shoplist-items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Shoplist item deleted successfully');

      // Verify item is deleted
      const getRes = await request(app)
        .get(`/api/shoplist-items?shoplistId=${shoplistId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getRes.body.length).toBe(0);
    });

    it('should not delete non-existent item', async () => {
      const res = await request(app)
        .delete('/api/shoplist-items/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 
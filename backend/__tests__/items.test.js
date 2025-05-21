import request from 'supertest';
import app from '../src/index.js';

describe('Items Endpoints', () => {
  let authToken;
  const testUser = {
    email: 'itemtest@example.com',
    password: 'password123',
    name: 'Item Test User'
  };

  const testItem = {
    name: 'Test Item',
    quantity: 5,
    tag: 'test',
    expiredDate: new Date(Date.now() + 86400000).toISOString() // tomorrow
  };

  beforeEach(async () => {
    // Create a test user and get token
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    authToken = signupRes.body.token;

    // Verify the token works by making a test request
    const verifyRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    
    if (verifyRes.status !== 200) {
      console.error('Token verification failed:', {
        status: verifyRes.status,
        body: verifyRes.body,
        error: verifyRes.error,
        headers: verifyRes.headers
      });
      throw new Error('Token verification failed');
    }
  });


  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      console.log('Making request with token:', authToken);
      
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItem);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', testItem.name);
      expect(res.body).toHaveProperty('quantity', testItem.quantity);
      expect(res.body).toHaveProperty('tag', testItem.tag);
    });

    it('should not create item without name', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testItem,
          name: ''
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not create item with negative quantity', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testItem,
          quantity: -1
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/items', () => {
    beforeEach(async () => {
      // Create some test items
      await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItem);

      await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testItem,
          name: 'Test Item 2',
          tag: 'test2'
        });
    });

    it('should get all items for user', async () => {
      const res = await request(app)
        .get('/api/items')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should filter items by tag', async () => {
      const res = await request(app)
        .get('/api/items?tag=test')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].tag).toBe('test');
    });

    it('should search items by name', async () => {
      const res = await request(app)
        .get('/api/items?search=Test Item 2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Test Item 2');
    });
  });

  describe('PUT /api/items/:id', () => {
    let itemId;

    beforeEach(async () => {
      // Create a test item
      const createRes = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItem);
      itemId = createRes.body.id;
    });

    it('should update an item', async () => {
      const updateData = {
        name: 'Updated Item',
        quantity: 10
      };

      const res = await request(app)
        .put(`/api/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', updateData.name);
      expect(res.body).toHaveProperty('quantity', updateData.quantity);
    });

    it('should not update non-existent item', async () => {
      const res = await request(app)
        .put('/api/items/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Item' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/items/:id', () => {
    let itemId;

    beforeEach(async () => {
      // Create a test item
      const createRes = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItem);
      itemId = createRes.body.id;
    });

    it('should delete an item', async () => {
      const res = await request(app)
        .delete(`/api/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Item deleted successfully');

      // Verify item is deleted
      const getRes = await request(app)
        .get(`/api/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getRes.statusCode).toBe(404);
    });

    it('should not delete non-existent item', async () => {
      const res = await request(app)
        .delete('/api/items/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 
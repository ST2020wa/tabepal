import request from 'supertest';
import app from '../src/index.js';

describe('Shopping Lists Endpoints', () => {
  let authToken;
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  };

  const testShoplist = {
    name: 'Test Shopping List'
  };

  beforeEach(async () => {
    // Create a test user and get token
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    authToken = signupRes.body.token;
  });

  describe('POST /api/shoplists', () => {
    it('should create a new shopping list', async () => {
      const res = await request(app)
        .post('/api/shoplists')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testShoplist);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', testShoplist.name);
      expect(res.body).toHaveProperty('userId');
    });

    it('should not create shopping list without name', async () => {
      const res = await request(app)
        .post('/api/shoplists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/shoplists', () => {
    beforeEach(async () => {
      // Create some test shopping lists
      await request(app)
        .post('/api/shoplists')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testShoplist);

      await request(app)
        .post('/api/shoplists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Shopping List 2'
        });
    });

    it('should get all shopping lists for user', async () => {
      const res = await request(app)
        .get('/api/shoplists')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('PUT /api/shoplists/:id', () => {
    let shoplistId;

    beforeEach(async () => {
      // Create a test shopping list
      const createRes = await request(app)
        .post('/api/shoplists')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testShoplist);
      shoplistId = createRes.body.id;
    });

    it('should update a shopping list', async () => {
      const updateData = {
        name: 'Updated Shopping List'
      };

      const res = await request(app)
        .put(`/api/shoplists/${shoplistId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.shoplist).toHaveProperty('name', updateData.name);
    });

    it('should not update non-existent shopping list', async () => {
      const res = await request(app)
        .put('/api/shoplists/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Shopping List' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/shoplists/:id', () => {
    let shoplistId;

    beforeEach(async () => {
      // Create a test shopping list
      const createRes = await request(app)
        .post('/api/shoplists')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testShoplist);
      shoplistId = createRes.body.id;
    });

    it('should delete a shopping list', async () => {
      const res = await request(app)
        .delete(`/api/shoplists/${shoplistId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Shoplist deleted successfully');

      // Verify shopping list is deleted
      const getRes = await request(app)
        .get('/api/shoplists')
        .set('Authorization', `Bearer ${authToken}`);
      expect(getRes.body.length).toBe(0);
    });

    it('should not delete non-existent shopping list', async () => {
      const res = await request(app)
        .delete('/api/shoplists/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 
import request from 'supertest';
import User from '../../user/user.model.js';

// Mock the User model
jest.mock('../../user/user.model.js');

// Mock AuthService.encryptPassword method
jest.mock('../services/auth.service.js', () => ({
  encryptPassword: jest.fn().mockReturnValue('encryptedPassword'),
}));

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user and return 201', async () => {
      User.create.mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      const res = await request(app).post('/users').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ success: true });
    });

    it('should handle errors', async () => {
      User.create.mockRejectedValue(new Error('Error creating user'));

      const res = await request(app).post('/users').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      });

      expect(res.status).toBe(500);
      expect(res.body).toBe('an error occurred please try again later');
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users = [{ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }];
      User.paginate.mockResolvedValue({
        docs: users,
        totalDocs: 1,
        limit: 10,
        totalPages: 1,
        page: 1,
      });

      const res = await request(app).get('/users').query({ page: 1, perPage: 10 });

      expect(res.status).toBe(200);
      expect(res.body.docs).toEqual(users);
    });

    it('should handle errors', async () => {
      User.paginate.mockRejectedValue(new Error('Error fetching users'));

      const res = await request(app).get('/users').query({ page: 1, perPage: 10 });

      expect(res.status).toBe(500);
      expect(res.body).toBe('an error occurred please try again later');
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      User.findById.mockResolvedValue(user);

      const res = await request(app).get('/users/someUserId');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(user);
    });

    it('should return 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      const res = await request(app).get('/users/someUserId');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'user not found ' });
    });

    it('should handle errors', async () => {
      User.findById.mockRejectedValue(new Error('Error fetching user'));

      const res = await request(app).get('/users/someUserId');

      expect(res.status).toBe(500);
      expect(res.body).toBe('an error occurred please try again later');
    });
  });

  describe('edit', () => {
    it('should update a user by ID', async () => {
      const userUpdated = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      User.findByIdAndUpdate.mockResolvedValue(userUpdated);

      const res = await request(app)
        .put('/users/someUserId')
        .send({ firstName: 'John', lastName: 'Doe' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(userUpdated);
    });

    it('should return 404 if user not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put('/users/someUserId')
        .send({ firstName: 'John', lastName: 'Doe' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'user not found ' });
    });

    it('should handle errors', async () => {
      User.findByIdAndUpdate.mockRejectedValue(new Error('Error updating user'));

      const res = await request(app)
        .put('/users/someUserId')
        .send({ firstName: 'John', lastName: 'Doe' });

      expect(res.status).toBe(500);
      expect(res.body).toBe('an error occurred please try again later');
    });
  });

  describe('destroy', () => {
    it('should delete a user by ID', async () => {
      User.findByIdAndDelete.mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      const res = await request(app).delete('/users/someUserId');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
    });

    it('should return 404 if user not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete('/users/someUserId');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'user not found ' });
    });

    it('should handle errors', async () => {
      User.findByIdAndDelete.mockRejectedValue(new Error('Error deleting user'));

      const res = await request(app).delete('/users/someUserId');

      expect(res.status).toBe(500);
      expect(res.body).toBe('an error occurred please try again later');
    });
  });

  describe('checkUnique', () => {
    it('should return 403 if user already exists', async () => {
      User.findById.mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      const res = await request(app).get('/users/checkUnique/someUserId');

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: 'you have already signup , please use sign in ' });
    });

    it('should call next if user does not exist', async () => {
      User.findById.mockResolvedValue(null);

      const res = await request(app).get('/users/checkUnique/someUserId');

      expect(res.status).toBe(200);
    });

    it('should handle errors', async () => {
      User.findById.mockRejectedValue(new Error('Error checking user'));

      const res = await request(app).get('/users/checkUnique/someUserId');

      expect(res.status).toBe(500);
      expect(res.body).toBe('an error occurred please try again later');
    });
  });
});

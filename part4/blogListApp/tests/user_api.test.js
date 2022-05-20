const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/users');

const api = supertest(app);

const initialDB = [
  {
    userName: '@user1',
    name: 'user one',
    password: 'random',
  },
  {
    userName: '@user2',
    name: 'user two',
    password: 'random',
  },
];

beforeEach(async () => {
  await User.deleteMany({});

  await User.insertMany(initialDB);
});

test('expect error message if username or password is missing', async () => {
  // userName is missing
  const user1 = {
    name: 'user two',
    password: '@11ia',
  };

  // password is missing
  const user3 = {
    userName: '@user3',
    name: 'user three',
  };

  const response1 = await api.post('/api/user').send(user1).expect(404);

  expect(response1.body.error).toBe('userName is missing');

  const response3 = await api.post('/api/user').send(user3).expect(404);
  expect(response3.body.error).toBe('password is missing');
});

test('expect error message if username or password is less than 3 character', async () => {
  const user1 = {
    userName: 'u',
    name: 'user one',
    password: '@i11',
  };

  const user2 = {
    userName: 'user 2',
    name: 'user two',
    password: '1',
  };

  const response1 = await api.post('/api/user').send(user1).expect(404);
  expect(response1.body.error).toBe(
    'userName must be at least 3 characters long'
  );

  const response2 = await api.post('/api/user').send(user2).expect(404);
  expect(response2.body.error).toBe(
    'password must be at least 3 characters long'
  );
});

test('expect error if user allready exist', async () => {
  const user1 = {
    userName: '@user1',
    name: 'user one',
    password: 'hello',
  };

  const response = await api.post('/api/user').send(user1).expect(404);

  expect(response.body.error).toBe('user allready exist');
});

test('user Successfully added in DB with hashed password', async () => {
  const user3 = {
    userName: '@user3',
    name: 'user three',
    password: '@iamuser3',
  };

  const response1 = await api.post('/api/user').send(user3).expect(201);

  expect(
    bcrypt.compareSync(user3.password, response1.body.password)
  ).toBeTruthy();
});

afterAll(async () => {
  await mongoose.connection.close();
});

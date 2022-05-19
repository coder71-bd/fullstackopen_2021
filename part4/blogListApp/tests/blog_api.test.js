const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blogs');

const api = supertest(app);

const initialDB = [
  {
    title: 'blog 1',
    author: 'any',
    url: 'https://www.blog1.com',
    likes: 33,
  },
  {
    title: 'blog 2',
    author: 'any',
    url: 'https://www.blog2.com',
    likes: 34,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialDB);
});

test('return the correct amount of blogs posts', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body.length).toBe(2);
});

test('blogs are returned in json format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  await mongoose.connection.close();
});

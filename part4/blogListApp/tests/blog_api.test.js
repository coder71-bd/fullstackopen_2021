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

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs');

  response.body.forEach((r) => {
    expect(r.id).toBeDefined();
  });
});

test('Successfully created a blog post', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'blog 3',
      author: 'any',
      url: 'https://www.blog3.com',
      likes: 34,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
});

test('total number of blogs in the system is increased by one', async () => {
  const prevBlogList = await api.get('/api/blogs');

  // add the blog
  await api.post('/api/blogs').send({
    title: 'blog 4',
    author: 'any',
    url: 'https://www.blog4.com',
    likes: 34,
  });

  const newBlogList = await api.get('/api/blogs');

  const difference = newBlogList.body.length - prevBlogList.body.length;

  expect(difference).toBe(1);
});

test('blogs likes property default value will be 0', async () => {
  const response = await api.post('/api/blogs').send({
    title: 'blog 4',
    author: 'any',
    url: 'https://www.blog4.com',
  });

  expect(response.body.likes).toBe(0);
});

test('status 404 if title and url property is missing', async () => {
  // title property is missing
  await api
    .post('/api/blogs')
    .send({
      author: 'any',
      url: 'https://www.blog5.com',
      like: 34,
    })
    .expect(404);

  // url property is missing
  await api
    .post('/api/blogs')
    .send({
      title: 'blog 6',
      author: 'any',
      like: 34,
    })
    .expect(404);

  // both url and title property is missing
  await api
    .post('/api/blogs')
    .send({
      title: 'blog 6',
      author: 'any',
      like: 34,
    })
    .expect(404);
});

afterAll(async () => {
  await mongoose.connection.close();
});

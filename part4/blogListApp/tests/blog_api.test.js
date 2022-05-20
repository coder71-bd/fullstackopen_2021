const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blogs');

const api = supertest(app);

let Token;

const initialDB = [
  {
    title: 'blog 1',
    author: 'any',
    url: 'https://www.blog1.com',
    likes: 33,
    user: ObjectId('62870e439cef875f14619599'),
  },
  {
    title: 'blog 2',
    author: 'any',
    url: 'https://www.blog2.com',
    likes: 34,
    user: ObjectId('62870e439cef875f14619599'),
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialDB);

  const response = await api.post('/api/login').send({
    userName: '@user1',
    password: '@iamuser1',
  });

  Token = 'Bearer ' + response.body.token;

  await Blog.updateMany({}, { user: ObjectId(response.body.id) });
});

test('return the correct amount of blogs posts', async () => {
  const response = await api.get('/api/blog').set('authorization', Token);

  expect(response.body.length).toBe(2);
});

test('blogs are returned in json format', async () => {
  await api
    .get('/api/blog')
    .set('authorization', Token)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blog').set('authorization', Token);

  response.body.forEach((r) => {
    expect(r.id).toBeDefined();
  });
});

test('Successfully created a blog post', async () => {
  await api
    .post('/api/blog')
    .set('authorization', Token)
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
  const prevBlogList = await api.get('/api/blog').set('authorization', Token);

  // add the blog
  await api.post('/api/blog').set('authorization', Token).send({
    title: 'blog 4',
    author: 'any',
    url: 'https://www.blog4.com',
    likes: 34,
  });

  const newBlogList = await api.get('/api/blog').set('authorization', Token);

  const difference = newBlogList.body.length - prevBlogList.body.length;

  expect(difference).toBe(1);
});

test('blogs likes property default value will be 0', async () => {
  const response = await api
    .post('/api/blog')
    .set('authorization', Token)
    .send({
      title: 'blog 4',
      author: 'any',
      url: 'https://www.blog4.com',
    });

  expect(response.body.likes).toBe(0);
});

test('status 404 if title and url property is missing', async () => {
  // title property is missing
  await api
    .post('/api/blog')
    .set('authorization', Token)
    .send({
      author: 'any',
      url: 'https://www.blog5.com',
      like: 34,
    })
    .expect(404);

  // url property is missing
  await api
    .post('/api/blog')
    .set('authorization', Token)
    .send({
      title: 'blog 6',
      author: 'any',
      like: 34,
    })
    .expect(404);

  // both url and title property is missing
  await api
    .post('/api/blog')
    .set('authorization', Token)
    .send({
      title: 'blog 6',
      author: 'any',
      like: 34,
    })
    .expect(404);
});

test('update likes of blog', async () => {
  const update = {
    likes: 50,
  };
  const response = await api.get('/api/blog').set('authorization', Token);
  const blogsToUpdate = response.body[0];

  await api
    .put(`/api/blog/${blogsToUpdate.id}`)
    .send(update)
    .set('authorization', Token);

  const responseAfterUpdate = await api
    .get('/api/blog')
    .set('authorization', Token);
  const updatedBlog = responseAfterUpdate.body[0];

  expect(updatedBlog.likes).toBe(50);
});

test('blog deletion successful', async () => {
  const response1 = await api.get('/api/blog').set('authorization', Token);
  const prevBlogs = response1.body;

  // take one id to perform deletion
  const blogsToDelete = prevBlogs[0];

  const deleted = await api
    .delete(`/api/blog/${blogsToDelete.id}`)
    .set('authorization', Token)
    .expect(200);

  const response2 = await api.get('/api/blog').set('authorization', Token);

  const newBlogs = response2.body;

  const difference = prevBlogs.length - newBlogs.length;
  expect(difference).toBe(1);

  const titles = newBlogs.map((blog) => blog.title);

  expect(titles).not.toContain(blogsToDelete.title);
});

afterAll(async () => {
  await mongoose.connection.close();
});

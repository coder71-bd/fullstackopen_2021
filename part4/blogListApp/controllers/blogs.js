const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  if (!request.body.title || !request.body.url) {
    response.status(404).json({
      message: 'insufficient data',
    });
    return;
  }

  const blog = new Blog(request.body);

  const result = await blog.save();

  response.status(201).json(result);
});

module.exports = blogsRouter;

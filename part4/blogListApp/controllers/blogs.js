const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blogs');
const User = require('../models/users');
const config = require('../utils/config');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    userName: 1,
    name: 1,
    id: 1,
  });

  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    response.status(404).json({
      message: 'insufficient data',
    });
    return;
  }

  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, config.JWT_SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({ ...request.body, user: user._id });

  const result = await blog.save();

  // add the blog id in user blogs array

  if (!user.blogs) {
    user.blogs = [];
  }

  await User.findOneAndUpdate(
    { id: user.id },
    { blogs: user.blogs.concat(result.id) }
  );

  response.status(201).json(result);
});

blogsRouter.put('/:id', async (request, response) => {
  const updateInfo = request.body;
  const { id } = request.params;

  const updatedBlog = await Blog.findOneAndUpdate({ id }, updateInfo);

  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await Blog.deleteOne({ id });
  response.status(204).json({
    message: 'successfully deleted blogs',
  });
});

module.exports = blogsRouter;

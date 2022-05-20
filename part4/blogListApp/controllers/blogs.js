const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blogs');
const User = require('../models/users');
const config = require('../utils/config');

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

  const decodedToken = jwt.verify(request.token, config.JWT_SECRET);

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

  const decodedToken = jwt.verify(request.token, config.JWT_SECRET);
  const blogToDelete = await Blog.findById(id);

  if (!blogToDelete) {
    response.status(404).json({
      error: "blog doesn't exist",
    });
    return;
  }

  if (decodedToken.id !== blogToDelete.user.toString()) {
    response.status(201).json({
      error: 'You are unauthorized to delete this blog',
    });
    return;
  }

  await Blog.findOneAndDelete({ _id: id });

  response.status(200).json({
    message: 'successfully deleted blogs',
  });
});

module.exports = blogsRouter;

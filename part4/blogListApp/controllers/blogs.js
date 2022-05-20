const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/users');

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

  const users = await User.find({});
  const designatedUser = users[0];

  const blog = new Blog({ ...request.body, user: designatedUser.id });

  const result = await blog.save();

  console.log(designatedUser);
  // add the blog id in user blogs array

  if (!designatedUser.blogs) {
    designatedUser.blogs = [];
  }

  await User.findOneAndUpdate(
    { id: designatedUser.id },
    { blogs: designatedUser.blogs.concat(result.id) }
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

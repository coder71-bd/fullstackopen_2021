const bcrypt = require('bcryptjs');

const userRouter = require('express').Router();

const User = require('../models/users');

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });

  const allUserInfo = users.map((user) => {
    const info = {
      userName: user.userName,
      name: user.name,
      id: user.id,
      blogs: user.blogs || [],
    };
    return info;
  });

  response.json(allUserInfo);
});

userRouter.post('/', async (request, response) => {
  const { userName, name, password } = request.body;

  if (!userName) {
    response.status(404).json({
      error: 'userName is missing',
    });
    return;
  }
  if (!password) {
    response.status(404).json({
      error: 'password is missing',
    });
    return;
  }

  if (userName.length < 3) {
    response.status(404).json({
      error: 'userName must be at least 3 characters long',
    });
    return;
  }

  if (password.length < 3) {
    response.status(404).json({
      error: 'password must be at least 3 characters long',
    });
    return;
  }

  const userExist = await User.find({ userName });

  if (userExist.length >= 1) {
    response.status(404).json({
      error: 'user allready exist',
    });
    return;
  }

  const saltRounds = bcrypt.genSaltSync(10);

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const newUser = {
    userName,
    name,
    password: hashedPassword,
  };

  const createdUser = await User.create(newUser);

  response.status(201).json(createdUser);
});

module.exports = userRouter;

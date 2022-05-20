const bcrypt = require('bcryptjs');

const userRouter = require('express').Router();

const User = require('../models/users');

userRouter.get('/', async (request, response) => {
  const users = await User.find({});

  const allUserInfo = users.map((user) => {
    const info = {
      userName: user.userName,
      name: user.name,
      id: user.id,
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
  if (!name) {
    response.status(404).json({
      error: 'name is missing',
    });
    return;
  }
  if (!password) {
    response.status(404).json({
      error: 'password is missing',
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

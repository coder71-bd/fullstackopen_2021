const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

loginRouter.post('/', async (request, response) => {
  const { userName, password } = request.body;

  const user = await User.findOne({ userName });

  const isUserValid =
    user === null ? false : bcrypt.compareSync(password, user.password);

  if (!(user && isUserValid)) {
    return response.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const userInfoForToken = {
    userName,
    id: user.id,
  };

  // expires in 2 hour
  const token = jwt.sign(userInfoForToken, config.JWT_SECRET, {
    expiresIn: '1h',
  });

  response.status(200).send({
    token,
    userName,
    name: user.name,
  });
});

module.exports = loginRouter;

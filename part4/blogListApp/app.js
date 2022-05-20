const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    logger.info('connected to mongodb');
  })
  .catch((error) => {
    logger.error('Error connecting to mongodb', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);

app.use('/api/blog', userExtractor, blogsRouter);
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
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
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blog', blogsRouter);
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

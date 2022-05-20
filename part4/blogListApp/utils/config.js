require('dotenv').config();
const PORT = process.env.PORT;
const MONGO_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URL
    : process.env.MONGO_URL;

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  PORT,
  MONGO_URL,
  JWT_SECRET,
};

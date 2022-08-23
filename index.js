const express = require('express');
const morgan = require('morgan');

const app = express();
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get('mongoUri'));

const { authRouter } = require('./routers/authRouter');
const { userRouter } = require('./routers/userRouter');
const { truckRouter } = require('./routers/truckRouter');
const { loadRouter } = require('./routers/loadRouter');

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/auth', authRouter);
app.use('/api/users/me', userRouter);
app.use('/api/trucks', truckRouter);
app.use('/api/loads', loadRouter);

const start = async () => {
  try {
    app.listen(config.get('port'));
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();

function errorHandler(err, req, res) {
  console.error(err);
  res.status(500).send({ message: 'Server error' });
}

app.use(errorHandler);

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || config.get('port');

mongoose.connect(config.get('mongoUri'));

const { authRouter } = require('./routers/authRouter');
const { userRouter } = require('./routers/userRouter');
const { taskRouter } = require('./routers/taskRouter');
const { dashboardRouter } = require('./routers/dashboardRouter');

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/dashboards', dashboardRouter);

const start = async () => {
  try {
    app.listen(PORT);
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

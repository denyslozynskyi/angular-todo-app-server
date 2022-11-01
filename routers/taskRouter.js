const express = require('express');
const {
  getTasks,
  getTask,
  editTask,
  createTask,
  deleteTask,
} = require('../services/taskService');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', authMiddleware, getTasks);
router.get('/task/:id', authMiddleware, getTask);
router.put('/edit/:id', authMiddleware, editTask);
router.post('/create', authMiddleware, createTask);
router.delete('/delete/:id', authMiddleware, deleteTask);

module.exports = {
  taskRouter: router,
};

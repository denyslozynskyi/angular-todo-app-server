const express = require('express');
const {
  getTasks,
  editTask,
  createTask,
  deleteTask,
} = require('../services/taskService');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', authMiddleware, getTasks);
router.put('/edit/:id', authMiddleware, editTask);
router.post('/create', authMiddleware, createTask);
router.delete('/delete/:id', authMiddleware, deleteTask);

module.exports = {
  taskRouter: router,
};

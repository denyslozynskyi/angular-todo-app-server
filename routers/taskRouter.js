const express = require('express');
const {
  getTasks,
  getTask,
  editTask,
  addComment,
  deleteComment,
  createTask,
  deleteTask,
} = require('../services/taskService');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', authMiddleware, getTasks);
router.get('/task/:id', authMiddleware, getTask);
router.put('/edit/:id', authMiddleware, editTask);
router.put('/task/:id/addcomment', authMiddleware, addComment);
router.put('/task/:id/deletecomment/:index', authMiddleware, deleteComment);
router.post('/create', authMiddleware, createTask);
router.delete('/delete/:id', authMiddleware, deleteTask);

module.exports = {
  taskRouter: router,
};

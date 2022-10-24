const express = require('express');
const {
  getDashboards,
  editDashboard,
  createDashboard,
  deleteDashboard,
} = require('../services/dashboardService');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('', authMiddleware, getDashboards);
router.put('/edit/:id', authMiddleware, editDashboard);
router.post('/create', authMiddleware, createDashboard);
router.delete('/delete/:id', authMiddleware, deleteDashboard);

module.exports = {
  dashboardRouter: router,
};

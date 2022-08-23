const express = require('express');
const {
  getTrucks, createTruck, getTruck, updateTruck, deleteTruck, assignTruck,
} = require('../services/truckServises');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getTrucks);
router.post('/', authMiddleware, createTruck);
router.get('/:id', authMiddleware, getTruck);
router.put('/:id', authMiddleware, updateTruck);
router.delete('/:id', authMiddleware, deleteTruck);
router.post('/:id/assign', authMiddleware, assignTruck);

module.exports = {
  truckRouter: router,
};

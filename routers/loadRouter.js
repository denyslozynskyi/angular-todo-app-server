const express = require('express');
const {
  getLoads, createLoad, getActiveLoad, toogleLoadState, getLoad,
  updateLoad, deleteLoad, postLoad, getShippingInfo,
} = require('../services/loadServices');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getLoads);
router.post('/', authMiddleware, createLoad);
router.get('/active', authMiddleware, getActiveLoad);
router.patch('/active/state', authMiddleware, toogleLoadState);
router.get('/:id', authMiddleware, getLoad);
router.put('/:id', authMiddleware, updateLoad);
router.delete('/:id', authMiddleware, deleteLoad);
router.post('/:id/post', authMiddleware, postLoad);
router.get('/:id/shipping_info', authMiddleware, getShippingInfo);

module.exports = {
  loadRouter: router,
};

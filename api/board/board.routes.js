const express = require('express');
// AUTHENTICATION MIDDLEWARE
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware');
// LOGGER
const { log } = require('../../middlewares/logger.middleware');
// SPECIFIC FUNCTIONS
const {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
} = require('./board.controller');
const router = express.Router();

// ROUTES
router.get('/', log, getBoards);
router.get('/:id', getBoardById);
router.post('/', addBoard);
router.put('/:id', updateBoard);
router.delete('/:id', removeBoard);

module.exports = router
// router.post('/', requireAuth, requireAdmin, addBoard);
// router.put('/:id', requireAuth, requireAdmin, updateBoard);
// router.delete('/:id', requireAuth, requireAdmin, removeBoard);

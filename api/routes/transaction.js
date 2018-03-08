const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth');
const transactionController = require('../controllers/transaction');

router.post('/create', checkAuth, transactionController.create);
router.get('/:transactionId', checkAuth, transactionController.details);
router.delete('/:transactionId', checkAuth, transactionController.delete);

module.exports = router;
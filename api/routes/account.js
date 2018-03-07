const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth');
const accountController = require('../controllers/account');

router.post('/create', checkAuth, accountController.create);
router.get('/:accountId', checkAuth, accountController.details);

module.exports = router;
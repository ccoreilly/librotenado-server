const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth');
const accountController = require('../controllers/account');

router.post('/create', checkAuth, accountController.create);
router.get('/:accountId', checkAuth, accountController.details);
router.patch('/:accountId', checkAuth, accountController.update);

module.exports = router;
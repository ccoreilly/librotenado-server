const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth');
const userController = require('../controllers/user');

router.post("/login", userController.login);
router.post("/signup", userController.signup);
// Only logged in users can view user profiles
router.get("/:userId", checkAuth, userController.profile);

module.exports = router;
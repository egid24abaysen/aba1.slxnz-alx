const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/register', [
  check('username').notEmpty().isLength({ min: 3 }),
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], authController.register);

router.post('/login', [
  check('username').notEmpty(),
  check('password').notEmpty()
], authController.login);

router.get('/me', require('../middleware/auth')(), authController.getMe);

module.exports = router;
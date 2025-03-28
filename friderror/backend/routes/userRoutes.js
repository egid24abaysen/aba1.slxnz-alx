const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth(['admin']), userController.getAllUsers);
router.get('/:id', auth(['admin']), userController.getUserById);
router.delete('/:id', auth(['admin']), userController.deleteUser);

module.exports = router;    
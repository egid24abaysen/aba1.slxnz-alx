const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');

router.get('/', carController.getAllCars);
router.get('/makes', carController.getCarMakes);
router.get('/:id', carController.getCarById);

// Protected routes
router.post('/', auth(), carController.createCar);
router.put('/:id', auth(), carController.updateCar);
router.delete('/:id', auth(['admin']), carController.deleteCar);

module.exports = router;
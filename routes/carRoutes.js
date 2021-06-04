const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

router.route('/car-stats').get(carController.getCarStats);
router.route('/').get(carController.getAllCars).post(carController.createCar);
router
	.route('/:id')
	.get(carController.getCar)
	.patch(carController.updateCar)
	.delete(carController.deleteCar);

module.exports = router;

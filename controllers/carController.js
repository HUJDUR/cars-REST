const Car = require('../models/carModel');
const handlerFactory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllCars = handlerFactory.getAll(Car);
exports.getCar = handlerFactory.getOne(Car);
exports.createCar = handlerFactory.createOne(Car);
exports.updateCar = handlerFactory.updateOne(Car);
exports.deleteCar = handlerFactory.deleteOne(Car);

exports.getCarStats = catchAsync(async function (req, res, next) {
	const stats = await Car.aggregate([
		{
			$group: {
				_id: null,
				avgRating: { $avg: '$rating' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' },
			},
		},
	]);

	res.status(200).json({
		status: 'success',
		data: {
			stats,
		},
	});
});

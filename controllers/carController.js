const { default: slugify } = require('slugify');
const Car = require('../models/carModel');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllCars = catchAsync(async function (req, res, next) {
	const features = new APIFeatures(Car.find(), req.query)
		.filter()
		.sort()
		.paginate()
		.limitFields();
	const cars = await features.query;

	res.status(200).json({
		status: 'success',
		results: cars.length,
		data: {
			cars,
		},
	});
});

exports.getCar = catchAsync(async function (req, res, next) {
	const car = await Car.findById(req.params.id);

	if (!car) {
		return next(AppError('There is no car with that ID.', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			car,
		},
	});
});

exports.createCar = catchAsync(async function (req, res, next) {
	const newCar = await Car.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			newCar,
		},
	});
});

exports.updateCar = catchAsync(async function (req, res, next) {
	const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!car) return next(new AppError('There is no car with that ID.', 404));

	res.status(200).json({
		status: 'success',
		data: {
			car,
		},
	});
});

exports.deleteCar = catchAsync(async function (req, res, next) {
	const car = await Car.findByIdAndDelete(req.params.id);

	if (!car) return next(new AppError('There is no car with that ID.', 404));

	//For some reason it doesn't send the json, just the status code
	res.status(204).json({
		status: 'success',
		data: null,
	});
});

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

const { default: slugify } = require('slugify');
const Car = require('../models/carModel');
const APIFeatures = require('../utils/APIFeatures');

exports.getAllCars = async function (req, res) {
	try {
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
	} catch (err) {
		console.log(err);
	}
};

exports.getCar = async function (req, res) {
	try {
		const car = await Car.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: {
				car,
			},
		});
	} catch (err) {
		console.log(err);
	}
};

exports.createCar = async function (req, res) {
	try {
		const newCar = await Car.create(req.body);
		res.status(201).json({
			status: 'success',
			data: {
				newCar,
			},
		});
	} catch (err) {
		console.log(err);
	}
};

exports.updateCar = async function (req, res) {
	try {
		const car = Car.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: 'success',
			data: {
				car,
			},
		});
	} catch (err) {
		console.log(err);
	}
};

exports.deleteCar = async function (req, res) {
	try {
		await Car.findByIdAndDelete(req.params.id);

		//For some reason it doesn't send the json, just the status code
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getCarStats = async function (req, res) {
	try {
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
	} catch (err) {
		console.log(err);
	}
};

const Car = require('../models/carModel');

exports.getAllCars = async function (_, res) {
	try {
		const find = await Car.find();
		res.status(200).json({
			status: 'success',
			data: {
				find,
			},
		});
	} catch (err) {}
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
	} catch (err) {}
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
	} catch (err) {}
};

exports.updateCar = async function (req, res) {
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
};

exports.deleteCar = async function (req, res) {
	try {
		await Car.findByIdAndDelete(req.params.id);

		//For some reason it doesn't send the json, just the status code
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {}
};

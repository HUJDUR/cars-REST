const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAll = (Model) =>
	catchAsync(async function (req, res, next) {
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.sort()
			.paginate()
			.limitFields();
		const doc = await features.query;

		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: {
				doc,
			},
		});
	});

exports.getOne = (Model) =>
	catchAsync(async function (req, res, next) {
		const doc = await Model.findById(req.params.id);

		if (!doc) {
			return next(new AppError('There is no document with that ID.', 404));
		}

		res.status(200).json({
			status: 'success',
			data: {
				doc,
			},
		});
	});

exports.createOne = (Model) =>
	catchAsync(async function (req, res, next) {
		const newDoc = await Model.create(req.body);
		res.status(201).json({
			status: 'success',
			data: {
				newDoc,
			},
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async function (req, res, next) {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc)
			return next(new AppError('There is no document with that ID.', 404));

		res.status(200).json({
			status: 'success',
			data: {
				doc,
			},
		});
	});

exports.deleteOne = (Model) =>
	catchAsync(async function (req, res, next) {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc)
			return next(new AppError('There is no document with that ID.', 404));

		//For some reason it doesn't send the json, just the status code
		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

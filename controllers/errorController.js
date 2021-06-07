const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;

	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;

	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field values. ${value}`;

	console.log(new AppError(message, 400).message);
	return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	let error = {};
	if (err.name === 'CastError') error = handleCastErrorDB(err);
	if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
	if (err.code === 11000) error = handleDuplicateFieldsDB(err);
	console.log(error.message);

	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
	});
};

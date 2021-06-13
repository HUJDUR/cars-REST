const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

dotenv.config({ path: '../config.env' });

console.log(typeof process.env.JWT_SECRET);

exports.signup = catchAsync(async function (req, res, next) {
	const user = await User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '9d',
	});

	res
		.cookie('jwt', token, {
			expiresIn: 9 * 24 * 60 * 60 * 1000, // 9 days in milliseconds
			// secure:true,
			httpOnly: true,
		})
		.status(200)
		.json({
			status: 'success',
			data: {
				user,
			},
		});
});

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.createUser = handlerFactory.createOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

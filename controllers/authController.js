const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { promisify } = require('util');

dotenv.config({ path: '../config.env' });

const jwtCreate = function (id) {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const signAndSendToken = function (user, res) {
	const token = jwtCreate(user._id);

	res.cookie('jwt', token, {
		expiresIn: Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000, // 9 days in milliseconds
		// secure: true,
		httpOnly: true,
	});

	user.password = undefined;

	res.status(200).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.signup = catchAsync(async function (req, res, next) {
	const user = await User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	signAndSendToken(user, res);
});

exports.login = catchAsync(async function (req, res, next) {
	const { email, password } = req.body;

	if (!email) return next(new AppError('Email is not specified.', 400));
	if (!password) return next(new AppError('Password is not specified.', 400));

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.comparePassword(password, user.password)))
		return next(new AppError('Incorrect email or password.', 401));

	signAndSendToken(user, res);
});

exports.authentication = catchAsync(async function (req, res, next) {
	//Is there a token in the request?
	const token = req.headers.authorization.split(' ')[1];
	if (!token) return next(new AppError('You are not logged in.', 401));

	//Is the token okay?
	const decodedToken = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);

	//Did the user delete the account in the meanwhile
	const user = await User.findById(decodedToken.id);
	if (!user) return next(new AppError('The account has been deleted.', 401));

	next();
});

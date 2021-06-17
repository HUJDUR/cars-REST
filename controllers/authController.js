const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const sendMail = require('../utils/email');

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
	// Is there a token in the request?
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return next(new AppError('You are not logged in.', 401));

	// Is the token okay?
	const decodedToken = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);

	// Did the user delete the account in the meanwhile
	const user = await User.findById(decodedToken.id).select('+role');
	if (!user) return next(new AppError('The account has been deleted.', 401));

	// Was the password changed
	if (await user.passwordChange(decodedToken.iat))
		return next(new AppError('The password has been changed.'), 401);

	req.user = user;
	next();
});

exports.authorization = function (req, res, next) {
	// Restrict only to admin role
	if (!(req.user.role === 'admin')) {
		return next(
			new AppError('You do not have permission to perform this action.', 403)
		);
	}

	next();
};

exports.updatePassword = catchAsync(async function (req, res, next) {
	const user = await User.findById(req.user.id).select('+password');

	if (!(await user.comparePassword(req.body.currentPassword, user.password)))
		return next(new AppError('Current password is wrong.', 401));

	user.password = req.body.newPassword;
	user.passwordConfirm = req.body.newPasswordConfirm;

	await user.save();

	signAndSendToken(user, res);
});

exports.forgotPassword = catchAsync(async function (req, res, next) {
	const user = await User.findOne({ email: req.body.email });

	if (!user)
		return next(new AppError('There is no user with that email.', 404));

	const resetToken = user.createResetToken();
	await user.save({ validateBeforeSave: false });

	const email = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Here is your password recovery email! PATCH request to ${email}.`;

	try {
		await sendMail({
			email: user.email,
			subject: 'Password Reset!',
			text: message,
		});

		res.status(200).json({
			status: 'success',
			message: 'Password reset email sent!',
		});
	} catch (err) {
		// Restore to default
		user.passwordResetToken = undefined;
		user.passwordResestTokenExpiration = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new AppError('There was an error sending the email.', 500));
	}
});

exports.resetPassword = catchAsync(async function (req, res, next) {
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.resetToken)
		.digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetTokenExpiration: { $gt: Date.now() },
	});

	if (!user)
		return next(new AppError('The token is invalid or has expired', 400));

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetTokenExpiration = undefined;

	await user.save();

	signAndSendToken(user, res);
});

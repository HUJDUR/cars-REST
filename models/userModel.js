const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'A user must have a username.'],
		trim: true,
		minlength: 8,
	},
	email: {
		type: String,
		required: [true, 'A user must have an email.'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email.'],
	},
	password: {
		type: String,
		required: [true, 'A user must have a password.'],
		minlength: [8, 'Password must be longer than 8 characters.'],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password.'],
		minlength: 8,
		validate: {
			validator: function () {
				return this.passwordConfirm === this.password;
			},
			message: 'Passwords are not the same.',
		},
	},
	role: {
		type: String,
		select: false,
		default: 'user',
		enum: {
			values: ['user', 'admin'],
			message: '{VALUE} is not supported.',
		},
	},
	passwordChangedAt: Date,
});

// Instance methods

userSchema.methods.comparePassword = async function (newPassword, dbPassword) {
	return await bcrypt.compare(newPassword, dbPassword);
};

userSchema.methods.passwordChange = async function (issuedToken) {
	if (this.passwordChangedAt) {
		const passwordChangeTime = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return issuedToken > passwordChangeTime;
	}

	return false;
};

// Middlewares

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;

	next();
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now();

	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

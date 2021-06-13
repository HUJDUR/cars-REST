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
		unique: [true, 'Email is already in use.'],
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
});

userSchema.pre('save', async function (doc) {
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

const sendEmail = async function (options) {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: 'Author :)',
		to: options.email,
		subject: options.subject,
		text: options.text,
	};

	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

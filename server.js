const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
	console.log('Uncaught exception!');
	console.error(err);
	process.exit(1);
});

const app = require('./app.js');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
	'<password>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Database connected!'));

let server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
	console.log('Unhandled rejection!');
	console.err(err);
	server.close(() => {
		process.exit(1);
	});
});

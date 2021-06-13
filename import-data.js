const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/carModel');

dotenv.config({ path: './config.env' });

const data = JSON.parse(fs.readFileSync('./test-data.json', 'utf-8'));

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

const importCars = async function () {
	try {
		await Car.create(data);
		console.log('Data successfully imported.');
	} catch (err) {
		console.log('There was an error importing data.');
	}

	process.exit();
};

const deleteCars = async function () {
	try {
		await Car.deleteMany();
		console.log('Data successfully deleted.');
	} catch (err) {
		console.log('There was an error deleting the data.');
	}

	process.exit();
};

if (process.argv[2] === '--import') importCars();
if (process.argv[2] === '--delete') deleteCars();

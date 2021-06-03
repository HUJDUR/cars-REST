const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
	carName: {
		type: String,
		required: [true, 'A car must have a brand name and model!'],
		trim: true,
		unique: true,
	},
	numberOfSales: {
		type: Number,
		required: [true, 'A car must have number of sales!'],
	},
	price: {
		type: Number,
	},
	rating: {
		type: Number,
		default: 4.5,
	},
	createdAt: {
		type: Date,
		default: new Date().toISOString(),
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;

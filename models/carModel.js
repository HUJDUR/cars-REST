const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
	carName: {
		type: String,
		required: [true, 'A car must have a brand name and model!'],
		trim: true,
	},
	numberOfSales: {
		type: Number,
		required: [true, 'A car must have number of sales!'],
	},
	approximatedPrice: {
		type: Number,
		required: false,
	},
	createdAt: {
		type: Date,
		default: new Date().toISOString(),
	},
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;

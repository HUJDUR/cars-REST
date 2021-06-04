const mongoose = require('mongoose');
const slugify = require('slugify');

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
	price: Number,
	rating: {
		type: Number,
		default: 4.5,
		min: [1, 'Rating must be above 1.0'],
		max: [5, 'Rating must be below 5.0'],
	},
	createdAt: {
		type: Date,
		default: new Date().toISOString(),
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	slug: String,
});

carSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;

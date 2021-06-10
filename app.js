const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const carRouter = require('./routes/carRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kB' }));
app.use(mongoSanitize());
app.use(xssClean());
app.use(
	rateLimit({
		max: 50,
		windowMs: 60 * 60 * 1000,
		message: 'You have reached the hourly limit of requests. Try later.',
	})
);

app.use('/api/v1/cars', carRouter);

app.all('*', (req, res, next) => {
	new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
	next();
});

app.use(globalErrorHandler);

module.exports = app;

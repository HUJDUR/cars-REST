const express = require('express');
const carRouter = require('./routes/carRoutes');

const app = express();
app.use(express.json());

app.use('/api/v1/cars', carRouter);

module.exports = app;

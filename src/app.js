const express = require('express');
const cors = require('cors');
const companyRoutes = require('./features/companies/companies.routes');
const employeeRoutes = require('./features/employees/employees.routes');
const driverRoutes = require('./features/drivers/drivers.routes');
const rideRoutes = require('./features/rides/rides.routes');
const authRoutes = require('./features/auth/auth.routes');

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));

app.use(express.json());

app.get('/api', (request, response) => {
  response.json({ message: 'A API do SaaS de Táxi está rodando!' });
});

app.use('/api', authRoutes);
app.use('/api', companyRoutes);
app.use('/api', employeeRoutes);
app.use('/api', driverRoutes);
app.use('/api', rideRoutes);

module.exports = app;
const express = require('express');
const cors = require('cors');
const db = require("./config/database");
const companyRoutes = require('./features/companies/companies.routes');
const employeeRoutes = require('./features/employees/employees.routes');
const driverRoutes = require('./features/drivers/drivers.routes');
const rideRoutes = require('./features/rides/rides.routes');
const authRoutes = require('./features/auth/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (request, response) => {
    return response.json({
        message: 'TaxiAPI is running!'
    });
});

app.use('/api', authRoutes);
app.use('/api', companyRoutes);
app.use('/api', employeeRoutes);
app.use('/api', driverRoutes);
app.use('/api', rideRoutes);

module.exports = app;
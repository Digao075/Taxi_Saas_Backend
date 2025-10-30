const { Router } = require('express');
const employeeController = require('./employees.controller');

const routes = Router();

routes.post('/employees', employeeController.create);
routes.get('/employees', employeeController.getAll);
routes.get('/employees/:id', employeeController.getById);
routes.get('/companies/:companyId/employees', employeeController.getByCompanyId);
routes.put('/employees/:id', employeeController.update);
routes.delete('/employees/:id', employeeController.remove);

module.exports = routes;
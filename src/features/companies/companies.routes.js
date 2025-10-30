const { Router } = require('express');
const companyController = require('./companies.controller');

const routes = Router();

routes.post('/companies', companyController.create);
routes.get('/companies', companyController.getAll);
routes.get('/companies/:id', companyController.getById);
routes.put('/companies/:id', companyController.update);
routes.delete('/companies/:id', companyController.remove);

module.exports = routes;
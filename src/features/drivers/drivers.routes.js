const { Router } = require('express');
const driverController = require('./drivers.controller');

const routes = Router();

routes.post('/drivers', driverController.create);

routes.get('/drivers', driverController.getAll);
routes.get('/drivers/:id', driverController.getById);

routes.put('/drivers/:id', driverController.update);
routes.delete('/drivers/:id', driverController.remove);

module.exports = routes;
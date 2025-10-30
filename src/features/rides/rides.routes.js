const { Router } = require('express');
const rideController = require('./rides.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

const routes = Router();

routes.post('/rides', authenticateToken, rideController.create);
routes.post('/rides', rideController.create); 
routes.get('/rides', rideController.getAll); 
routes.get('/rides/:id', rideController.getById); 
routes.put('/rides/:id', rideController.update); 
routes.delete('/rides/:id', rideController.remove); 

module.exports = routes;
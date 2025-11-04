const { Router } = require('express');
const authController = require('./auth.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');
const routes = Router();

routes.post('/auth/login', authController.login);
routes.post('/auth/admin/login', authController.loginAdmin);
routes.put('/auth/admin/change-password', authenticateToken, authController.changeAdminPassword);
module.exports = routes;
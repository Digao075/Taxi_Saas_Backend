const authService = require('./auth.service');

const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }
    const result = await authService.loginEmployee(email, password);
    if (result.error) {
      return response.status(401).json({ message: result.message });
    }

    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const loginAdminController = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const result = await authService.loginAdmin(email, password);

    if (result.error) {
      return response.status(401).json({ message: result.message });
    }

    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const changeAdminPassword = async (request, response) => {
  try {
    const { newPassword } = request.body;
    const adminId = request.user.id; 

    if (!newPassword || newPassword.length < 6) {
      return response.status(400).json({ message: 'A nova senha é obrigatória e deve ter no mínimo 6 caracteres.' });
    }

    const updatedAdmin = await authService.changeAdminPassword(adminId, newPassword);
    return response.status(200).json(updatedAdmin);

  } catch (error) {
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  login: login,
  loginAdmin: loginAdminController,
  changeAdminPassword: changeAdminPassword,
};
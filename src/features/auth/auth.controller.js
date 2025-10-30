const authService = require('./auth.service');

const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const result = await authService.loginEmployee(email, password);

    if (result.error) {
      return response.status(401).json({ message: result.message }); // 401 Unauthorized
    }

    return response.status(200).json(result);
  } catch (error) {
    console.error('Erro no login:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  login,
};
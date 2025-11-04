const jwt = require('jsonwebtoken');

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return response.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decodedPayload) => {
    if (error) {
      return response.status(403).json({ message: 'Token inválido ou expirado.' });
    }
    request.user = decodedPayload;
    next();
  });
};

module.exports = {
  authenticateToken,
};
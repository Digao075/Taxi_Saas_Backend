const db = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginEmployee = async (email, password) => {
  const findQuery = 'SELECT * FROM employees WHERE email = $1;';
  const { rows: employees } = await db.query(findQuery, [email]);
  const employee = employees[0];

  if (!employee) {
    return { error: 'not_found', message: 'Credenciais inválidas.' };
  }

  const isPasswordValid = await bcrypt.compare(password, employee.password_hash);

  if (!isPasswordValid) {
    return { error: 'not_found', message: 'Credenciais inválidas.' };
  }

  const payload = {
    id: employee.id,
    name: employee.full_name,
    companyId: employee.company_id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '8h', 
  });

  delete employee.password_hash;

  return { employee, token };
};

module.exports = {
  loginEmployee,
};
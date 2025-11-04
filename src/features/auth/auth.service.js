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
    role: 'employee',
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
  delete employee.password_hash;
  return { employee, token };
};

const loginAdmin = async (email, password) => {
  const findQuery = 'SELECT * FROM admins WHERE email = $1;';
  const { rows: admins } = await db.query(findQuery, [email]);
  const admin = admins[0];

  if (!admin) {
    return { error: 'not_found', message: 'Credenciais inválidas.' };
  }
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

  if (!isPasswordValid) {
    return { error: 'not_found', message: 'Credenciais inválidas.' };
  }

  const payload = {
    id: admin.id,
    name: admin.full_name,
    role: admin.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });

  delete admin.password_hash;
  return { admin, token };
};
const changeAdminPassword = async (adminId, newPassword) => {
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  
  const query = `
    UPDATE admins 
    SET password_hash = $1 
    WHERE id = $2 
    RETURNING id, email, full_name, role;
  `;
  
  const { rows } = await db.query(query, [newPasswordHash, adminId]);
  return rows[0];
};

module.exports = {
  loginEmployee,
  loginAdmin,
  changeAdminPassword,
};
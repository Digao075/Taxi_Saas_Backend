const db = require('../../config/database');
const bcrypt = require('bcrypt');

const createEmployee = async (employeeData) => {
  const { company_id, full_name, email, password } = employeeData;

  const password_hash = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO employees (company_id, full_name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id, company_id, full_name, email, status, created_at;
  `;
  
  const params = [company_id, full_name, email, password_hash];
  
  const { rows } = await db.query(query, params);
  
  return rows[0];
};

const getAllEmployees = async () => {
  const query = 'SELECT id, company_id, full_name, email, status, created_at FROM employees ORDER BY full_name ASC;';
  const { rows } = await db.query(query);
  return rows;
};

const getEmployeesByCompanyId = async (companyId) => {
  const query = 'SELECT id, company_id, full_name, email, status, created_at FROM employees WHERE company_id = $1 ORDER BY full_name ASC;';
  const { rows } = await db.query(query, [companyId]);
  return rows;
};

const getEmployeeById = async (id) => {
  const query = 'SELECT id, company_id, full_name, email, phone_number, default_address, status, created_at FROM employees WHERE id = $1;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const updateEmployee = async (id, employeeData) => {
  const { full_name, email, phone_number, default_address, status, password } = employeeData;
  
  let password_hash;
  if (password) {

    password_hash = await bcrypt.hash(password, 10);
  }


  const existingEmployee = (await db.query('SELECT * FROM employees WHERE id = $1', [id])).rows[0];
  if (!existingEmployee) return null;

  const query = `
    UPDATE employees
    SET
      full_name = $1,
      email = $2,
      phone_number = $3,
      default_address = $4,
      status = $5,
      password_hash = $6
    WHERE id = $7
    RETURNING id, company_id, full_name, email, status, created_at;
  `;

  const params = [
    full_name || existingEmployee.full_name,
    email || existingEmployee.email,
    phone_number || existingEmployee.phone_number,
    default_address || existingEmployee.default_address,
    status || existingEmployee.status,
    password_hash || existingEmployee.password_hash,
    id
  ];

  const { rows } = await db.query(query, params);
  return rows[0];
};

const deleteEmployeeById = async (id) => {
  const query = 'DELETE FROM employees WHERE id = $1 RETURNING id, full_name, email;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeesByCompanyId,
  getEmployeeById,
  updateEmployee,
  deleteEmployeeById,
};
const db = require('../../config/database');

const createCompany = async (companyData) => {
    const { name, cnpj, contact_name, contact_email } = companyData;

    const query = `
    INSERT INTO companies (name, cnpj, contact_name, contact_email)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

    const params = [name, cnpj, contact_name, contact_email];

    const { rows } = await db.query(query, params);

    return rows[0];
};

const getAllCompanies = async () => {
  const query = 'SELECT * FROM companies ORDER BY name ASC;';
  const { rows } = await db.query(query);
  return rows;
};

const getCompanyById = async (id) => {
  const query = 'SELECT * FROM companies WHERE id = $1;';
  const { rows } = await db.query(query, [id]);
  return rows[0]; 
};

const updateCompany = async (id, companyData) => {
  const { name, cnpj, contact_name, contact_email, status } = companyData;
  const query = `
    UPDATE companies
    SET name = $1, cnpj = $2, contact_name = $3, contact_email = $4, status = $5
    WHERE id = $6
    RETURNING *;
  `;
  const params = [name, cnpj, contact_name, contact_email, status, id];
  const { rows } = await db.query(query, params);
  return rows[0];
};

const deleteCompanyById = async (id) => {
  const query = 'DELETE FROM companies WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};


module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompanyById,
};
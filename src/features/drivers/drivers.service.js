const db = require('../../config/database');
const bcrypt = require('bcrypt');

const createDriver = async (driverData) => {
  const { full_name, email, password, phone_number, license_plate, vehicle_model } = driverData;

  const password_hash = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO drivers (full_name, email, password_hash, phone_number, license_plate, vehicle_model)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, full_name, email, phone_number, license_plate, vehicle_model, status, is_online, created_at;
  `;
  
  const params = [full_name, email, password_hash, phone_number, license_plate, vehicle_model];
  
  const { rows } = await db.query(query, params);
  
  return rows[0];
};

const getAllDrivers = async () => {
  const query = `
    SELECT id, full_name, email, phone_number, license_plate, vehicle_model, status, is_online, created_at 
    FROM drivers 
    ORDER BY full_name ASC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

const getDriverById = async (id) => {
  const query = `
    SELECT id, full_name, email, phone_number, license_plate, vehicle_model, status, is_online, created_at 
    FROM drivers 
    WHERE id = $1;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const updateDriver = async (id, driverData) => {
  const { full_name, email, phone_number, license_plate, vehicle_model, status, is_online, password, commission_rate } = driverData;

  const existingDriver = (await db.query('SELECT * FROM drivers WHERE id = $1', [id])).rows[0];
  if (!existingDriver) return null;

  let password_hash;
  if (password) {
    password_hash = await bcrypt.hash(password, 10);
  }

  const query = `
    UPDATE drivers
    SET
      full_name = $1, email = $2, phone_number = $3, license_plate = $4,
      vehicle_model = $5, status = $6, is_online = $7, password_hash = $8,
      commission_rate = $9
    WHERE id = $10
    RETURNING *; 
  `;

  const params = [
    full_name || existingDriver.full_name,
    email || existingDriver.email,
    phone_number || existingDriver.phone_number,
    license_plate || existingDriver.license_plate,
    vehicle_model || existingDriver.vehicle_model,
    status || existingDriver.status,
    is_online !== undefined ? is_online : existingDriver.is_online,
    password_hash || existingDriver.password_hash,
    commission_rate || existingDriver.commission_rate,
    id
  ];

  const { rows } = await db.query(query, params);
  return rows[0];
};

const deleteDriverById = async (id) => {
  const query = 'DELETE FROM drivers WHERE id = $1 RETURNING id, full_name, email;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriverById,
};
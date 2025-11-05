const db = require('../../config/database');
const crypto = require('crypto');

function generateVoucher() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

const createRide = async (rideData) => {
  const { origin_address, destination_address, employee_id, scheduled_for = null } = rideData;
  const voucher = generateVoucher();
  const insertQuery = `
    INSERT INTO rides (origin_address, destination_address, employee_id, scheduled_for, voucher_code)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [origin_address, destination_address, employee_id, scheduled_for, voucher];
  const { rows } = await db.query(insertQuery, values);
  return rows[0];
};

const getAllRides = async (filters) => {
  const { status, company_id, driver_id, startDate, endDate } = filters;
  let query = `
    SELECT 
      r.id, r.voucher_code, r.origin_address, r.destination_address,
      r.requested_at, r.scheduled_for, r.completed_at, r.price, r.status,
      e.full_name as employee_name, 
      e.company_id as employee_company_id,
      d.full_name as driver_name,
      d.commission_rate as driver_commission_rate
    FROM rides r
    LEFT JOIN employees e ON r.employee_id = e.id
    LEFT JOIN drivers d ON r.driver_id = d.id
    WHERE 1=1
  `;
  const queryParams = [];
  let paramIndex = 1;
  if (status) {
    query += ` AND r.status = $${paramIndex++}`;
    queryParams.push(status);
  }
  if (driver_id) {
    query += ` AND r.driver_id = $${paramIndex++}`;
    queryParams.push(driver_id);
  }
  if (company_id) {
    query += ` AND e.company_id = $${paramIndex++}`;
    queryParams.push(company_id);
  }
  if (startDate) {
    query += ` AND r.requested_at >= $${paramIndex++}`;
    queryParams.push(startDate);
  }
  if (endDate) {
    query += ` AND r.requested_at <= $${paramIndex++}`;
    queryParams.push(endDate);
  }
  query += ' ORDER BY r.requested_at DESC;';
  const { rows } = await db.query(query, queryParams);
  return rows;
};

const getRideById = async (id) => {
  const query = 'SELECT * FROM rides WHERE id = $1;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const updateRide = async (id, rideData) => {
  const { driver_id, status, price, admin_notes } = rideData;
  const findQuery = 'SELECT * FROM rides WHERE id = $1;';
  const { rows: existingRideRows } = await db.query(findQuery, [id]);
  const existingRide = existingRideRows[0];
  if (!existingRide) return null;

  let completed_at = existingRide.completed_at;
  if (status === 'completed' && existingRide.status !== 'completed') {
    completed_at = new Date();
  }

  const query = `
    UPDATE rides
    SET
      driver_id = $1,
      status = $2,
      price = $3,
      completed_at = $4,
      admin_notes = $5 
    WHERE id = $6
    RETURNING *;
  `;
  const params = [
    driver_id || existingRide.driver_id,
    status || existingRide.status,
    price || existingRide.price,
    completed_at,
    admin_notes || existingRide.admin_notes,
    id
  ];
  
  const { rows } = await db.query(query, params);
  return rows[0];
};

const deleteRideById = async (id) => {
  const query = 'DELETE FROM rides WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  createRide,
  getAllRides,
  getRideById,
  updateRide,
  deleteRideById,
};
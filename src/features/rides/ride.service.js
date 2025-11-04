const db = require('../../config/database');

const createRide = async (rideData) => {
  const { origin_address, destination_address, employee_id, scheduled_for = null } = rideData;
  
  const insertQuery = `
    INSERT INTO rides (origin_address, destination_address, employee_id, scheduled_for)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [origin_address, destination_address, employee_id, scheduled_for];
  
  const { rows } = await db.query(insertQuery, values);
  return rows[0];
};

const getAllRides = async (status) => {
  let query = 'SELECT * FROM rides';
  const queryParams = [];

  if (status) {
    queryParams.push(status);
    query += ' WHERE status = $1';
  }

  query += ' ORDER BY requested_at DESC;';
  
  const { rows } = await db.query(query, queryParams);
  return rows;
};

const getRideById = async (id) => {
  const query = 'SELECT * FROM rides WHERE id = $1;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};


const updateRide = async (id, rideData) => {
  const { driver_id, status, price } = rideData;
  
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
      completed_at = $4
    WHERE id = $5
    RETURNING *;
  `;
  const params = [
    driver_id || existingRide.driver_id,
    status || existingRide.status,
    price || existingRide.price,
    completed_at,
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
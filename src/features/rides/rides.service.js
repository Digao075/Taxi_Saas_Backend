const db = require('../../config/database');

const createRide = async (rideData) => {
  const { employee_id, origin_address, destination_address, origin_lat, origin_lng, destination_lat, destination_lng, scheduled_for } = rideData;
  const query = `
    INSERT INTO rides (
      employee_id, origin_address, destination_address, origin_lat, origin_lng, destination_lat, destination_lng
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const params = [employee_id, origin_address, destination_address, origin_lat, origin_lng, destination_lat, destination_lng, scheduled_for];
  const { rows } = await db.query(query, params);
  return rows[0];
};

const getAllRides = async () => {
  const query = 'SELECT * FROM rides ORDER BY requested_at DESC;';
  const { rows } = await db.query(query);
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
  const { rows: existingRide } = await db.query(findQuery, [id]);
  if (existingRide.length === 0) return null;

  let completed_at = existingRide[0].completed_at;
  if (status === 'completed' && existingRide[0].status !== 'completed') {
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
    driver_id || existingRide[0].driver_id,
    status || existingRide[0].status,
    price || existingRide[0].price,
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
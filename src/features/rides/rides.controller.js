const { get } = require('./rides.routes');
const rideService = require('./rides.service');

const create = async (request, response) => {
  try {
    const employeeId = request.employee.id;
    const rideData = { ...request.body, employee_id: employeeId };
    if (rideData.scheduled_for && isNaN(new Date(rideData.scheduled_for).getTime())) {
      return response.status(400).json({ message: 'Formato de data inválido para scheduled_for.' });
    }
    const newRide = await rideService.createRide(rideData);
    return response.status(201).json(newRide);
  } catch (error) {
    console.error('Erro ao solicitar corrida:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getAll = async (request, response) => {
  try {
    const rides = await rideService.getAllRides();
    return response.status(200).json(rides);
  } catch (error) {
    console.error('Erro ao buscar corridas:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getById = async (request, response) => {
  try {
    const ride = await rideService.getRideById(request.params.id);
    if (!ride) return response.status(404).json({ message: 'Corrida não encontrada.' });
    return response.status(200).json(ride);
  } catch (error) {
    console.error('Erro ao buscar corrida:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const update = async (request, response) => {
  try {
    const updatedRide = await rideService.updateRide(request.params.id, request.body);
    if (!updatedRide) return response.status(404).json({ message: 'Corrida não encontrada.' });
    return response.status(200).json(updatedRide);
  } catch (error) {
    console.error('Erro ao atualizar corrida:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const remove = async (request, response) => {
  try {
    const deletedRide = await rideService.deleteRideById(request.params.id);
    if (!deletedRide) return response.status(404).json({ message: 'Corrida não encontrada.' });
    return response.status(200).json({ message: 'Corrida excluída com sucesso.', ride: deletedRide });
  } catch (error) {
    console.error('Erro ao excluir corrida:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
const rideService = require('./ride.service');

const createRide = async (request, response) => {
  try {
    const { origin_address, destination_address, scheduled_for } = request.body;
    const employeeId = request.user.id; 

    if (scheduled_for) {
      const scheduleTime = new Date(scheduled_for);
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      if (scheduleTime < now) {
        return response.status(400).json({ message: 'Não é possível agendar uma corrida para uma data passada.' });
      }
      if (scheduleTime < oneHourFromNow) {
        return response.status(400).json({ message: 'A corrida deve ser agendada com pelo menos 1 hora de antecedência.' });
      }
    }

    const rideData = { 
      origin_address, 
      destination_address, 
      scheduled_for, 
      employee_id: employeeId 
    };

    const newRide = await rideService.createRide(rideData);
    return response.status(201).json(newRide);

  } catch (error) {
    if (error.code === '23503') {
      return response.status(404).json({ message: 'Colaborador com o ID fornecido não existe.' });
    }
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getAll = async (request, response) => {
  try {
    const filters = request.query;
    const rides = await rideService.getAllRides(filters);
    return response.status(200).json(rides);
  } catch (error) {
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getById = async (request, response) => {
  try {
    const ride = await rideService.getRideById(request.params.id);
    if (!ride) return response.status(404).json({ message: 'Corrida não encontrada.' });
    return response.status(200).json(ride);
  } catch (error) {
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const update = async (request, response) => {
  try {
    const updatedRide = await rideService.updateRide(request.params.id, request.body);
    if (!updatedRide) return response.status(404).json({ message: 'Corrida não encontrada.' });
    return response.status(200).json(updatedRide);
  } catch (error) {
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const remove = async (request, response) => {
  try {
    const deletedRide = await rideService.deleteRideById(request.params.id);
    if (!deletedRide) return response.status(404).json({ message: 'Corrida não encontrada.' });
    return response.status(200).json({ message: 'Corrida excluída com sucesso.', ride: deletedRide });
  } catch (error) {
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  create: createRide,
  getAll,
  getById,
  update,
  remove,
};
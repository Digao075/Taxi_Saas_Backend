const driverService = require('./drivers.service');

const create = async (request, response) => {
  try {
    const driverData = request.body;
    
    const requiredFields = ['full_name', 'email', 'password', 'phone_number', 'license_plate'];
    for (const field of requiredFields) {
      if (!driverData[field]) {
        return response.status(400).json({ message: `O campo '${field}' é obrigatório.` });
      }
    }

    const newDriver = await driverService.createDriver(driverData);

    return response.status(201).json(newDriver);

  } catch (error) {
    console.error('Erro ao criar motorista:', error);
    if (error.code === '23505') {
       return response.status(409).json({ message: 'Email ou placa já cadastrados.' });
    }
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getAll = async (request, response) => {
  try {
    const drivers = await driverService.getAllDrivers();
    return response.status(200).json(drivers);
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getById = async (request, response) => {
  try {
    const { id } = request.params;
    const driver = await driverService.getDriverById(id);

    if (!driver) {
      return response.status(404).json({ message: 'Motorista não encontrado.' });
    }

    return response.status(200).json(driver);
  } catch (error) {
    console.error('Erro ao buscar motorista por ID:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const update = async (request, response) => {
  try {
    const { id } = request.params;
    const driverData = request.body;
    const updatedDriver = await driverService.updateDriver(id, driverData);

    if (!updatedDriver) {
      return response.status(404).json({ message: 'Motorista não encontrado para atualização.' });
    }

    return response.status(200).json(updatedDriver);
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error);
    if (error.code === '23505') {
      return response.status(409).json({ message: 'Email ou placa já cadastrados.' });
    }
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const remove = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedDriver = await driverService.deleteDriverById(id);

    if (!deletedDriver) {
      return response.status(404).json({ message: 'Motorista não encontrado para exclusão.' });
    }
    
    return response.status(200).json({ message: 'Motorista excluído com sucesso.', driver: deletedDriver });
  } catch (error) {
    console.error('Erro ao deletar motorista:', error);
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
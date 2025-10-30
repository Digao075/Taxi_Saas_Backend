const employeeService = require('./employees.service');

const create = async (request, response) => {
  try {
    const employeeData = request.body;

    const requiredFields = ['company_id', 'full_name', 'email', 'password'];
    for (const field of requiredFields) {
      if (!employeeData[field]) {
        return response.status(400).json({
          message: `O campo '${field}' é obrigatório.`
        });
      }
    }

    const newEmployee = await employeeService.createEmployee(employeeData);

    return response.status(201).json(newEmployee);

  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    if (error.code === '23505') {
       return response.status(409).json({ message: 'Email já cadastrado.' });
    }
    if (error.code === '23503') {
      return response.status(404).json({ message: 'Empresa com o ID fornecido não encontrada.' });
    }
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getAll = async (request, response) => {
  try {
    const employees = await employeeService.getAllEmployees();
    return response.status(200).json(employees);
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getByCompanyId = async (request, response) => {
  try {
    const { companyId } = request.params;
    const employees = await employeeService.getEmployeesByCompanyId(companyId);
    return response.status(200).json(employees);
  } catch (error) {
    console.error('Erro ao buscar colaboradores por empresa:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
}; 

const getById = async (request, response) => {
  try {
    const { id } = request.params;
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) {
      return response.status(404).json({ message: 'Colaborador não encontrado.' });
    }
    return response.status(200).json(employee);
  } catch (error) {
    console.error('Erro ao buscar colaborador por ID:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const update = async (request, response) => {
  try {
    const { id } = request.params;
    const employeeData = request.body;

    const updatedEmployee = await employeeService.updateEmployee(id, employeeData);

    if (!updatedEmployee) {
      return response.status(404).json({ message: 'Colaborador não encontrado para atualização.' });
    }
const existingEmployee = (await db.query('SELECT * FROM employees WHERE id = $1', [id])).rows[0];
  if (!existingEmployee) return null;
    return response.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    if (error.code === '23505') { 
      return response.status(409).json({ message: 'Email já cadastrado em outra conta.' });
    }
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const remove = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedEmployee = await employeeService.deleteEmployeeById(id);

    if (!deletedEmployee) {
      return response.status(404).json({ message: 'Colaborador não encontrado para exclusão.' });
    }
    
    return response.status(200).json({ message: 'Colaborador excluído com sucesso.', employee: deletedEmployee });
  } catch (error) {
    console.error('Erro ao deletar colaborador:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  create,
  getAll,
  getByCompanyId,
  getById,
  update,
  remove,
};
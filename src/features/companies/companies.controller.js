const companyService = require('./companies.service');

const create = async (request, response) => {
    try {
        const companyData = request.body;

        if (!companyData.name || !companyData.cnpj) {
            return response.status(400).json({
                message: 'Nome e CNPJ são obrigatórios'
            });
        }

        const newCompany = await companyService.createCompany(companyData);

        return response.status(201).json(newCompany);
    } catch (error) {
        console.error('Error to create company', error);
        if (error.code === '23505') {
            return response.status(409).json({ message: 'CNPJ already used'});
        }
        return response.status(500).json({ message: 'internal server error'});  
    }
};

const getAll = async (request, response) => {
  try {
    const companies = await companyService.getAllCompanies();
    return response.status(200).json(companies);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getById = async (request, response) => {
  try {
    const { id } = request.params;
    const company = await companyService.getCompanyById(id);

    if (!company) {
      return response.status(404).json({ message: 'Empresa não encontrada.' });
    }

    return response.status(200).json(company);
  } catch (error) {
    console.error('Erro ao buscar empresa por ID:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
}; 

const update = async (request, response) => {
  try {
    const { id } = request.params;
    const companyData = request.body;
    const updatedCompany = await companyService.updateCompany(id, companyData);

    if (!updatedCompany) {
      return response.status(404).json({ message: 'Empresa não encontrada para atualização.' });
    }

    return response.status(200).json(updatedCompany);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    if (error.code === '23505') { 
      return response.status(409).json({ message: 'CNPJ já cadastrado em outra empresa.' });
    }
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const remove = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedCompany = await companyService.deleteCompanyById(id);

    if (!deletedCompany) {
      return response.status(404).json({ message: 'Empresa não encontrada para exclusão.' });
    }
    return response.status(200).json({ message: 'Empresa excluída com sucesso.', company: deletedCompany });
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
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
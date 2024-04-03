const  StatusCodes  = require("http-status-codes");
const AppError = require("../utils/Error/app-error");

class curdRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }
  async destroy(data) {
    const response = await this.model.destroy({
      where: {
        id: data,
      },
    });
    if(!response){
      throw new AppError('not able to find the resource',StatusCodes.NOT_FOUND)
    }
    return response;
  }
  async get(data) {
    const response = await this.model.findByPk(data);
    if(!response){
      throw new AppError('not able to find the resource', StatusCodes.NOT_FOUND)
    }
    return response;
  }
  async getAll() {
    const response = await this.model.findAll();
    return response;
  }
  async update(id, data) {
      const [response] = await this.model.update(data, {
        where : {
            id : id
        }
      });
      if(response === 0){
        throw new AppError('not able to find resource to update',StatusCodes.NOT_FOUND)
      }
      const updatedResource = await this.model.findByPk(id);
      return updatedResource;
  }
}

module.exports = curdRepository;
export default class BasicManager {
  constructor(model) {
    this.model = model;
  }

  async findAll({
    limit = 10,
    sort = null,
    page = 1,
    query = null,
    endpoint = null,
  }) {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const options = {
      page,
      limit,
    };

    let filter = {};

    if (query) {
      try {
        const queryObj = JSON.parse(query);
        filter = queryObj;
      } catch (error) {}
    }
    if (sort) {
      options.sort = sort;
    }
    try {
      const result = await this.model.paginate(filter, options); // Cambio aquí
      const baseUrl = endpoint + "?limit=" + limit + "&sort=" + sort;
      const info = {
        status: result.status,
        count: result.totalDocs,
        pages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prev: result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}` : null,
        next: result.hasNextPage ? `${baseUrl}&page=${result.nextPage}` : null,
      };
      return { info, results: result.docs };
    } catch (error) {
      return { error: error.message };
    }
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async createOne(obj) {
    console.log("obj", obj);
    return this.model.create(obj);
  }

  async updateOne(id, obj) {
    return this.model.updateOne({ _id: id }, obj);
  }

  async deleteOne(id) {
    return this.model.deleteOne({ _id: id });
  }
}

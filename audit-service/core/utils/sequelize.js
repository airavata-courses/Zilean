class SequelizePaginator {
  constructor(page = 1, perPage = 10) {
    this.perPage = (parseInt(perPage, 10) > 100 && 100) || parseInt(perPage, 10);
    this.currentPage = parseInt(page, 10);
  }

  paginate(model, whereClause, includes = {}, sortOrder = {}) {
    if (typeof model === 'undefined') {
      throw Error('Missing argument: Sequelize Model');
    }
    if (Number.isNaN(this.perPage) || this.perPage <= 0) {
      throw new Error('Invalid page number');
    }

    if (Number.isNaN(this.currentPage) || this.currentPage <= 0) {
      throw new Error('Invalid page number');
    }

    const offset = (this.currentPage - 1) * this.perPage;
    const defaultOptions = {
      offset,
      limit: (this.perPage > 100 && 100) || this.perPage
    };

    const options = {
      distinct: true,
      order: sortOrder,
      include: includes,
      where: whereClause
    };

    return model.findAndCountAll(Object.assign({}, defaultOptions, options))
      .then((result) => {
        const { count } = result;
        const list = result.rows;
        let meta = {};
        if (count !== 0) {
          const lastPage = Math.ceil(count / this.perPage);
          meta = {
            firstQuery: `page=1&limit=${this.perPage}`,
            lastQuery: `page=${lastPage}&limit=${this.perPage}`,
            total: count,
            perPage: this.perPage,
            currentPage: this.currentPage,
            lastPage
          };
          if (this.currentPage !== 1) {
            meta.prevQuery = `page=${this.currentPage - 1}&limit=${this.perPage}`;
          }
          if (this.currentPage !== lastPage) {
            meta.nextQuery = `page=${this.currentPage + 1}&limit=${this.perPage}`;
          }
        }

        return {
          list,
          meta
        };
      });
  }
}

module.exports = SequelizePaginator;

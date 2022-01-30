const _ = require('lodash');
const moment = require('moment');

const db = require('../../db/models');

const { Op } = db.Sequelize;

const orderOperationMap = {
  DESC: Op.lt,
  ASC: Op.gt,
};

const decodeCursor = (cursor) => {
  return JSON.parse(Buffer.from(cursor, 'base64').toString());
};

const encodeCursor = (cursor) => {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
};

const hasNextPage = (count, limit) => {
  return count > limit;
};

const response = (resourceList, count, limit, nextCursor = '') => {
  return {
    metadata: {
      total: count,
      next_cursor: hasNextPage(count, limit) ? nextCursor : ''
    },
    data: resourceList
  };
};


class ValuePaginator {
  constructor(model, sortOrder, filter = {}, includedResources = []) {
    this.model = model;
    this.db = db;
    this.sortOrder = sortOrder;
    this.filter = filter;
    this.includedResources = includedResources;
  }

  getPaginationFilterClause(cursor) {
    let paginationClause = [];
    const decodedCursor = (cursor && decodeCursor(cursor)) || '';

    if (_.isEmpty(cursor)) {
      return {};
    }

    for (let i = 0; i < this.sortOrder.length; i += 1) {
      let subClause = {};
      for (let j = 0; j <= i; j += 1) {
        if (decodedCursor[this.sortOrder[j].key]) {
          if (i === j) {
            subClause = {
              ...subClause,
              [this.sortOrder[j].key]: {
                [orderOperationMap[this.sortOrder[j].order]]: decodedCursor[this.sortOrder[j].key]
              }
            };
          } else {
            subClause = {
              ...subClause,
              [this.sortOrder[j].key]: decodedCursor[this.sortOrder[j].key]
            };
          }
        }
      }
      if (!_.isEmpty(subClause)) {
        paginationClause = [...paginationClause, subClause];
      }
    }

    if (_.isEmpty(paginationClause)) {
      return {};
    }

    return {
      [Op.or]: paginationClause
    };
  }

  getFilterClause() {
    return this.filter;
  }

  getIncludes() {
    return this.includedResources;
  }

  getSortQuery() {
    return this.sortOrder.map((order) => ([order.key, order.order]));
  }

  /*
    cursor: <Type: String> (pagination cursor),
    limit: <Type: integer> (number of records to fetch)
  */

  async paginate(cursor, limit = 20) {
    const order = this.getSortQuery();
    const paginationClause = this.getPaginationFilterClause(
      cursor
    );
    const filterClause = this.getFilterClause();

    const includes = this.getIncludes();

    const respose = await this.model.findAndCountAll({
      where: {
        ...paginationClause,
        ...filterClause
      },
      order,
      include: includes,
      limit
    });

    if (respose.rows.length === 0) {
      return response(
        respose.rows,
        respose.count,
        limit,
        ''
      );
    }
    const lastItem = respose.rows[respose.rows.length - 1];

    const nextCursor = _.isNil(lastItem) ? '' : this.getEncodedNextCursor(lastItem);

    return response(
      respose.rows,
      respose.count,
      limit,
      nextCursor
    );
  }

  getEncodedNextCursor(lastItem) {
    return encodeCursor(
      _.reduce(this.sortOrder, (acc, sortOrder) => {
        const cursorValue = this.isSortKeyDateType(sortOrder)
          ? moment.utc(lastItem[sortOrder.key]).format()
          : lastItem[sortOrder.key];
        return {
          ...acc,
          [sortOrder.key]: cursorValue
        };
      }, {
        strategy: 'value'
      })
    );
  }

  isSortKeyDateType(sortOrder) {
    return this.model.tableAttributes[sortOrder.key].type.constructor.key === 'DATE';
  }
}

module.exports = ValuePaginator;

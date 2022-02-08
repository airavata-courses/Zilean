/* eslint-disable import/no-extraneous-dependencies */
const _ = require('lodash');
const logger = require('logger');

module.exports = () => {
    return (req, res, next) => {
        req.jsonapi = {
        filter: {},
        sparse_fieldsets: {},
        include: [],
        page_data: {},
        sort: [],
        optional_fields: []
        };

        if (!_.isNull(req.query.filter) && !_.isEmpty(req.query.filter)) {
            Object.keys(req.query.filter).forEach((key) => {
                req.jsonapi.filter[key] = req.query.filter[key].split(',').map(value => value.trim());
            });
        }

        if (!_.isNull(req.query.page) && !_.isEmpty(req.query.page)) {
            req.jsonapi.page_data.page = parseInt(req.query.page, 10);
        }

        if (!_.isNull(req.query.limit) && !_.isEmpty(req.query.limit)) {
            req.jsonapi.page_data.limit = parseInt(req.query.limit, 10);
        }

        if (!_.isNull(req.query.fields) && !_.isEmpty(req.query.fields)) {
            Object.keys(req.query.fields).forEach((key) => {
                req.jsonapi.sparse_fieldsets[key] = req.query.fields[key].split(',').map(value => value.trim());
            });
        }

        if (!_.isNull(req.query.optional_fields) && !_.isEmpty(req.query.optional_fields)) {
            Object.keys(req.query.optional_fields).forEach((key) => {
                req.jsonapi.optional_fields[key] = req.query.optional_fields[key].split(',').map(value => value.trim());
            });
        }

        if (!_.isNull(req.query.include) && !_.isEmpty(req.query.include)) {
            req.jsonapi.include = req.query.include.split(',').map(value => value.trim());
        }

        if (!_.isNull(req.query.sort) && !_.isEmpty(req.query.sort)) {
            const sortParams = req.query.sort.split(',').map(value => value.trim());
            sortParams.forEach((sortParameter) => {
                if (sortParameter[0] === '-') {
                    req.jsonapi.sort.push({
                        order: 'DESC',
                        parameter: sortParameter.substring(1, sortParameter.length)
                    });
                } else {
                    req.jsonapi.sort.push({
                        order: 'ASC',
                        parameter: sortParameter
                    });
                }
            });
        }
    next();
    };
};

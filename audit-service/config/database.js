const e = require("express");

function normalizeInt(text, defaultValue) {
    return text && !Number.isNaN(text) ? parseInt(text, 10) : defaultValue;
}

module.exports = {
    "dev": {
        use_env_variable: undefined,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        logging: process.env.SQL_LOGGING_ENABLED === 'true' ? console.log : false,
        define: {
            underscored: true
        },
        dialectOptions: {
            decimalNumbers: true,
        },
        allowed_comparision_operators: ['gt', 'gte', 'lt', 'lte'],
        pool: {
            max: normalizeInt(process.env.DB_CONNECTION_POOL_MAX_CONNECTIONS, 5),
            min: normalizeInt(process.env.DB_CONNECTION_POOL_MIN_CONNECTIONS, 0),
            idle: normalizeInt(process.env.IDLE, 50000),
            acquire: normalizeInt(process.env.ACQUIRE, 60000)
        }
    },
    "test": {
        use_env_variable: undefined,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        logging: process.env.SQL_LOGGING_ENABLED === 'true' ? console.log : false,
        define: {
            underscored: true
        },
        dialectOptions: {
            decimalNumbers: true,
        },
        allowed_comparision_operators: ['gt', 'gte', 'lt', 'lte'],
        pool: {
            max: normalizeInt(process.env.DB_CONNECTION_POOL_MAX_CONNECTIONS, 5),
            min: normalizeInt(process.env.DB_CONNECTION_POOL_MIN_CONNECTIONS, 0),
            idle: normalizeInt(process.env.IDLE, 50000),
            acquire: normalizeInt(process.env.ACQUIRE, 60000)
        }
    },
    "prod": {
        use_env_variable: undefined,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        logging: process.env.SQL_LOGGING_ENABLED === 'true' ? console.log : false,
        define: {
            underscored: true
        },
        dialectOptions: {
            decimalNumbers: true,
        },
        allowed_comparision_operators: ['gt', 'gte', 'lt', 'lte'],
        pool: {
            max: normalizeInt(process.env.DB_CONNECTION_POOL_MAX_CONNECTIONS, 5),
            min: normalizeInt(process.env.DB_CONNECTION_POOL_MIN_CONNECTIONS, 0),
            idle: normalizeInt(process.env.IDLE, 50000),
            acquire: normalizeInt(process.env.ACQUIRE, 60000)
        }
    }
}



module.exports = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION,
    logging: process.env.SQL_LOGGING_ENABLED === 'true' ? console.log : false,
    define: {
        underscored: true
    },
    dialectOptions: {
        decimalNumbers: true,
    },
    allowed_comparision_operators: ['gt', 'gte', 'lt', 'lte'],
    pool: {
        max: normalizeInt(process.env.DB_CONNECTION_POOL_MAX_CONNECTIONS, 5),
        min: normalizeInt(process.env.DB_CONNECTION_POOL_MIN_CONNECTIONS, 0),
        idle: normalizeInt(process.env.IDLE, 50000),
        acquire: normalizeInt(process.env.ACQUIRE, 60000)
    }
};
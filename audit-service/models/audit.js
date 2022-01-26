'use strict';

module.exports = (sequelize, DataTypes) => {
    const Audit = sequelize.define('Audit', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        request: {
            type: DataTypes.JSON
        },
        response: {
            type: DataTypes.JSON
        }, 
        service_provider_identifier: {
            type: DataTypes.TEXT
        },
        is_deleted: { 
            type: DataTypes.BOOLEAN,
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        service_identifier: {
            type: DataTypes.STRING
        },
}, {
    tableName: 'audit'
});
    return Audit;
};


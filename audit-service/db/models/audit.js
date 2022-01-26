'use strict';

module.exports = (sequelize, DataTypes) => {
    const Audit = sequelize.define('Audit', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uuid: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        user_id: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        request: {
            required: true,
            type: DataTypes.JSON
        },
        response: {
            required: true,
            type: DataTypes.JSON
        }, 
        service_provider_identifier: {
            required: true,
            type: DataTypes.TEXT
        },
        is_deleted: { 
            default: false,
            type: DataTypes.BOOLEAN,
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE
        }
}, {
    tableName: 'Audit'
});
    return Audit;
};


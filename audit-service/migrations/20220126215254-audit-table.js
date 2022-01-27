'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('audits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      user_id: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      request: {
        required: true,
        type: Sequelize.JSON
      },
      response: {
        required: true,
        type: Sequelize.JSON
      },
      service_provider_identifier: {
        required: true,
        type: Sequelize.TEXT
      },
      is_deleted: {
        default: false,
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('audits');
  }
};
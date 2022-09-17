'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.STRING
      },
      author_ref: {
        type: Sequelize.STRING
      },
      created_utc: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.STRING
      },
      downs: {
        type: Sequelize.INTEGER
      },
      flair_text: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      page_id: {
        type: Sequelize.STRING
      },
      page_name: {
        type: Sequelize.STRING
      },
      self_text: {
        type: Sequelize.TEXT
      },
      timestamp: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.TEXT
      },
      ups: {
        type: Sequelize.INTEGER
      },
      upvote_ratio: {
        type: Sequelize.FLOAT
      },
      url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('listings');
  }
};
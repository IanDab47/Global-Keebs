'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.listing.belongsToMany(models.user, { through: 'users_listings' })
      models.listing.belongsToMany(models.comment, { through: 'comments_listings' })
    }
  }
  listing.init({
    author: DataTypes.STRING,
    author_ref: DataTypes.STRING,
    created_utc: DataTypes.INTEGER,
    date: DataTypes.STRING,
    downs: DataTypes.INTEGER,
    flair_text: DataTypes.STRING,
    location: DataTypes.STRING,
    page_id: DataTypes.STRING,
    page_name: DataTypes.STRING,
    self_text: DataTypes.TEXT,
    timestamp: DataTypes.STRING,
    title: DataTypes.TEXT,
    ups: DataTypes.INTEGER,
    upvote_ratio: DataTypes.FLOAT,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'listing',
  });
  return listing;
};
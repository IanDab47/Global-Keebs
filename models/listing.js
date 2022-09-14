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
      models.listing.hasMany(models.comment)
    }
  }
  listing.init({
    author: DataTypes.STRING,
    author_ref: DataTypes.STRING,
    created_utc: DataTypes.INTEGER,
    downs: DataTypes.INTEGER,
    flair_text: DataTypes.STRING,
    location: DataTypes.STRING,
    page_id: DataTypes.STRING,
    page_name: DataTypes.STRING,
    self_text: DataTypes.STRING,
    timestamp: DataTypes.STRING,
    title: DataTypes.STRING,
    ups: DataTypes.INTEGER,
    upvote_ratio: DataTypes.FLOAT,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'listing',
  });
  return listing;
};
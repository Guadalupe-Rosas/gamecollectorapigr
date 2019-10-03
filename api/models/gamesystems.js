'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gamesystems = sequelize.define('postgres', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Gamesystems.associate = function(models) {
    // associations can be defined here
  };
  return Gamesystems;
};
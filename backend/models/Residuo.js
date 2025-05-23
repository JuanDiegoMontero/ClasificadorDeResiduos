const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Residuo = sequelize.define('Residuo', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Residuo;

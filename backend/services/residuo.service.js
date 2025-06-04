const Residuo = require('../models/Residuo');

async function crearResiduo(nombre, tipo) {
  return await Residuo.create({ nombre, tipo });
}

async function obtenerResiduos() {
  return await Residuo.findAll();
}

module.exports = { crearResiduo, obtenerResiduos };

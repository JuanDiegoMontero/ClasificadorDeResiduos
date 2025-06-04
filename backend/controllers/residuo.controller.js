const { crearResiduo, obtenerResiduos } = require('../services/residuo.service');

async function crear(req, res) {
  const { nombre, tipo } = req.body;
  try {
    const nuevo = await crearResiduo(nombre, tipo);
    res.json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const todos = await obtenerResiduos();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { crear, listar };

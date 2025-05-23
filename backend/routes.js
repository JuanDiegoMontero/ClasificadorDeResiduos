const express = require('express');
const router = express.Router();
const Residuo = require('./models/Residuo');
const sequelize = require('./database');

sequelize.sync();

router.post('/residuos', async (req, res) => {
  const { nombre, tipo } = req.body;
  try {
    const nuevo = await Residuo.create({ nombre, tipo });
    res.json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/residuos', async (req, res) => {
  try {
    const todos = await Residuo.findAll();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

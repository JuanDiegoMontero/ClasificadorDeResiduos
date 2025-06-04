const express = require('express');
const router = express.Router();
const { crear, listar } = require('../controllers/residuo.controller');

router.post('/residuos', crear);
router.get('/residuos', listar);

module.exports = router;

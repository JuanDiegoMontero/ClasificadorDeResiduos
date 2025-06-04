const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/database');
const rutasResiduos = require('./routes/residuo.routes');

app.use(cors());
app.use(express.json());

db.sync();

app.use('/api', rutasResiduos);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

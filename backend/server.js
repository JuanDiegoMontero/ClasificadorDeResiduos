const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database');
const routes = require('./routes');

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

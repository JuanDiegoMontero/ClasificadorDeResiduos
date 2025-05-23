// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para guardar un residuo
export const guardarResiduo = async (nombre, tipo) => {
  const response = await api.post('/residuos', { nombre, tipo });
  return response.data;
};

// Función para listar residuos (si quieres usarla después)
export const obtenerResiduos = async () => {
  const response = await api.get('/residuos');
  return response.data;
};

export default api;

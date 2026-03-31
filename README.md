# ♻️ AI Waste Classification System

![App Demo](./demo.png)

Una aplicación Full-Stack impulsada por Inteligencia Artificial diseñada para la clasificación en tiempo real de residuos sólidos domésticos mediante visión por computadora (Computer Vision). 

Este proyecto demuestra la implementación de modelos de Machine Learning en el navegador y la persistencia de datos transaccionales mediante una arquitectura limpia (MVC).

## 🚀 Arquitectura y Tecnologías

El sistema está dividido en dos capas principales:

* **Frontend (Cliente IA):** * Construido con **React.js** y **Bootstrap** para una UI/UX responsiva.
  * Integración de **TensorFlow.js** (vía `@teachablemachine/image`) para ejecutar el modelo de Computer Vision directamente en el cliente, reduciendo la latencia de inferencia y ahorrando costos de servidor.
* **Backend (API & Persistencia):**
  * Desarrollado en **Node.js** con **Express**.
  * Arquitectura basada en capas (Routes, Controllers, Services, Models) para escalabilidad.
  * ORM **Sequelize** conectándose a una base de datos **SQLite** para el registro rápido y ligero de los residuos clasificados.

## ✨ Funcionalidades Principales

1. **Inferencia en Tiempo Real:** Clasificación de residuos usando el feed de la cámara web.
2. **Análisis de Archivos Estáticos:** Procesamiento y predicción sobre imágenes subidas por el usuario.
3. **Persistencia Automática:** Cada detección exitosa se registra automáticamente en la base de datos relacional para analítica posterior.

---

## ⚙️ Instrucciones de Ejecución Local

Para correr este proyecto en tu máquina, necesitas tener [Node.js](https://nodejs.org/) instalado.

### 1. Iniciar el Backend (API)
Abre una terminal en la raíz del proyecto y navega a la carpeta del backend:

```bash
cd backend
npm install
node server.js
```

### 2. Iniciar el Frontend (React App)
Abre **otra** terminal en la raíz del proyecto (la carpeta principal):

```bash
npm install
npm start
```
*(La aplicación se abrirá automáticamente en tu navegador por defecto, usualmente en http://localhost:3000).*

## 📄 Licencia
Este proyecto está bajo la Licencia [CC BY-NC 4.0](http://creativecommons.org/licenses/by-nc/4.0/).

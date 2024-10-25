import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100"  >
            <p className="display-1 fw-bold text-primary text-center">
                Clasificador de Residuos con Inteligencia Artificial Para Hogares
            </p>
            <div className="d-flex justify-content-center mt-4">
                <Link to="/camera" className="btn btn-primary mx-2"> Utilizar Camara de Dispositivo </Link>
                <Link to="/file" className="btn btn-secondary mx-2">Subir una Imagen</Link>
            </div>
        </div>
        
    );
}

export default App;

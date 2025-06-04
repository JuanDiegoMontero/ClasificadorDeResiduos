import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
    return (
        
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center px-3">
            <div className="container">
                <h1 className="display-4 fw-bold text-primary mb-3">
                    Clasificador de Residuos
                </h1>
                <h2 className="h4 text-secondary mb-4">
                    con Inteligencia Artificial para Hogares
                </h2>
                <p className="lead text-muted mb-5">
                    Clasifica residuos usando tu cámara o una imagen desde tu dispositivo.
                </p>
                <div className="d-flex justify-content-center flex-wrap gap-3">
                    <Link to="/camera" className="btn btn-success btn-lg px-4 py-2">
                        📷 Usar Cámara
                    </Link>
                    <Link to="/file" className="btn btn-secondary btn-lg px-4 py-2">
                        📁 Subir Imagen
                    </Link>
                </div>
            </div>

            <footer className="mt-5 text-muted small">
                Hecho con ❤️ por Juan Diego Montero Murcia • <a href="https://github.com/JuanDiegoMontero">GitHub</a>
            </footer>
        </div>
        
    );
}

export default App;


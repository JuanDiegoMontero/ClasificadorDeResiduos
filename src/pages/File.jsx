import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { guardarResiduo } from '../api'; // 💡 Importar la función Axios

function App() {
    const URL = "https://teachablemachine.withgoogle.com/models/1ep6Tneuh/";
    const [model, setModel] = useState(null);
    const [maxPredictions, setMaxPredictions] = useState(0);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [uploadedImage, setUploadedImage] = useState(null);

    useEffect(() => {
        async function loadModel() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            const loadedModel = await tmImage.load(modelURL, metadataURL);
            setModel(loadedModel);
            setMaxPredictions(loadedModel.getTotalClasses());
            setIsModelLoading(false);

            const labelContainer = document.getElementById("label-container");
            labelContainer.innerHTML = '';
            labelContainer.appendChild(document.createElement("div"));
        }

        loadModel();
    }, []);

    function getContainerLabel(prediction) {
    const highest = prediction.reduce((max, p) => (p.probability > max.probability ? p : max), prediction[0]);

    const mapClassToTipo = {
        "Blanco": { text: "Contenedor Blanco", color: "grey", textColor: "black", tipo: "Reciclable" },
        "Negro":  { text: "Contenedor Negro", color: "black", textColor: "white", tipo: "No reciclable" },
        "Verde":  { text: "Contenedor Verde", color: "green", textColor: "white", tipo: "Orgánico" }
    };

    return mapClassToTipo[highest.className] || {
        text: "Desconocido", color: "red", textColor: "white", tipo: "Desconocido"
    };
}


    async function predict(image) {
        if (!model) {
            console.error("El modelo no se ha cargado aún.");
            return;
        }

        const prediction = await model.predict(image);
        const labelContainer = document.getElementById("label-container");

        const { text, color, textColor, tipo } = getContainerLabel(prediction);
        labelContainer.childNodes[0].innerHTML = text;
        labelContainer.childNodes[0].style.backgroundColor = color;
        labelContainer.childNodes[0].style.color = textColor;
        labelContainer.childNodes[0].style.padding = "10px";
        labelContainer.childNodes[0].style.borderRadius = "5px";
        

        // ✅ Guardar automáticamente en el backend
        try {
            await guardarResiduo("Residuo desde archivo", tipo);
            console.log("Residuo guardado correctamente ✅");
        } catch (error) {
            console.error("Error al guardar el residuo ❌", error);
        }
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file && model) {
            const image = document.createElement('img');
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                image.src = reader.result;
                setUploadedImage(reader.result);
                image.onload = async () => {
                    await predict(image);
                };
            };
        } else {
            console.error("El modelo no está cargado o no se seleccionó ningún archivo.");
        }
    };

    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center px-3">
            <div className="container">
                <h1 className="display-4 fw-bold text-primary mb-3">
                    Clasificador de Residuos
                </h1>
                <h2 className="h5 text-secondary mb-4">
                    con Inteligencia Artificial para Hogares
                </h2>

                <p className="lead text-muted mb-4">
                    Sube una imagen del residuo para clasificarlo automáticamente.
                </p>

                <label className="btn btn-success btn-lg mb-4">
                    📁 Seleccionar Imagen
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        hidden 
                        disabled={isModelLoading}
                    />
                </label>

                {uploadedImage && (
                    <div className="mb-4">
                        <img 
                            src={uploadedImage} 
                            alt="Imagen subida" 
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                    </div>
                )}

                {isModelLoading && <p className="text-muted">Cargando modelo...</p>}

                <div id="label-container" className="text-center mb-3"></div>

                <Link to="/" className="btn btn-secondary mt-4">🏠 Volver al Inicio</Link>
            </div>
        </div>
        </>
    );
}

export default App;

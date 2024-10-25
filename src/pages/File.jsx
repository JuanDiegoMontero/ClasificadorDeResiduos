import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

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
        if (highest.className === "Blanco") return { text: "Contenedor Blanco", color: "grey", textColor: "black" };
        if (highest.className === "Negro") return { text: "Contenedor Negro", color: "black", textColor: "white" };
        return { text: "Contenedor Verde", color: "green", textColor: "white" };
    }

    async function predict(image) {
        if (!model) {
            console.error("El modelo no se ha cargado aún.");
            return;
        }

        const prediction = await model.predict(image);
        const labelContainer = document.getElementById("label-container");

        
        const { text, color, textColor } = getContainerLabel(prediction);
        labelContainer.childNodes[0].innerHTML = text;
        labelContainer.childNodes[0].style.backgroundColor = color;
        labelContainer.childNodes[0].style.color = textColor;
        labelContainer.childNodes[0].style.padding = "10px";
        labelContainer.childNodes[0].style.borderRadius = "5px";
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
        <p className="display-1 fw-bold text-primary text-center">Clasificador de Residuos con Inteligencia Artificial Para Hogares</p>

        <div className="container d-flex flex-column align-items-center justify-content-center vh-50">
            
            <h1 className="display-4 text-center mb-4">Sube una imagen para clasificar</h1>

            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="btn btn-primary mb-4"
                disabled={isModelLoading}
            />

           
            {uploadedImage && (
                <img 
                    src={uploadedImage} 
                    alt="Imagen subida" 
                    className="img-fluid rounded mb-3"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            )}
            
            {isModelLoading && <p>Cargando modelo...</p>}

            <div id="label-container" className="text-center"></div>
        <Link to="/" className="btn btn-secondary mx-2 mt-4">Volver al Inicio</Link>

        </div>

        </>
    );
}

export default App;

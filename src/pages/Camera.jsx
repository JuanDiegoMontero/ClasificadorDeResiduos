import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function CameraPage() {
    const URL = "https://teachablemachine.withgoogle.com/models/1ep6Tneuh/";
    const [model, setModel] = useState(null);
    const [maxPredictions, setMaxPredictions] = useState(0);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [webcam, setWebcam] = useState(null);
    const [predictionResult, setPredictionResult] = useState({ text: "", color: "", textColor: "" });

    useEffect(() => {
        async function loadModel() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            const loadedModel = await tmImage.load(modelURL, metadataURL);
            setModel(loadedModel);
            setMaxPredictions(loadedModel.getTotalClasses());
            setIsModelLoading(false);
        }

        loadModel();

      
        return () => {
            if (webcam) {
                webcam.stop();
                setWebcam(null);
            }
        };
    }, [webcam]);

    async function initWebcam() {
        if (!model) {
            console.error("Model is not loaded yet.");
            return;
        }

        const flip = true;
        const newWebcam = new tmImage.Webcam(400, 400, flip); 
        await newWebcam.setup(); 
        await newWebcam.play(); 
        setWebcam(newWebcam);
        document.getElementById("webcam-container").appendChild(newWebcam.canvas);

        window.requestAnimationFrame(() => loop(newWebcam));
    }

    async function loop(newWebcam) {
        newWebcam.update(); 
        await predict(newWebcam.canvas); 
        window.requestAnimationFrame(() => loop(newWebcam)); 
    }

    function getContainerLabel(prediction) {
        const highest = prediction.reduce((max, p) => (p.probability > max.probability ? p : max), prediction[0]);
        if (highest.className === "Blanco") return { text: "Contenedor Blanco", color: "grey", textColor: "black" };
        if (highest.className === "Negro") return { text: "Contenedor Negro", color: "black", textColor: "white" };
        return { text: "Contenedor Verde", color: "green", textColor: "white" };
    }

    async function predict(image) {
        if (!model) {
            console.error("Model is not loaded yet.");
            return;
        }

        const prediction = await model.predict(image);
        const { text, color, textColor } = getContainerLabel(prediction);
        
        setPredictionResult({ text, color, textColor });
    }

    return (
        <>
            <p className="display-1 fw-bold text-primary text-center">Clasificador de Residuos con Inteligencia Artificial Para Hogares</p>
            <div className="d-flex flex-column justify-content-center align-items-center vh-50">
                <h1 className="display-4 text-center mb-4">Coloca el residuo frente a la camara para clasificar</h1>
                <button
                    type="button"
                    onClick={initWebcam}
                    className="btn btn-primary btn-lg mb-4"
                    disabled={isModelLoading}
                >
                    Encender Cámara
                </button>

                {isModelLoading && <p>Cargando modelo...</p>}

                <div id="webcam-container" className="d-flex justify-content-center"></div>

                
                {predictionResult.text && (
                    <div 
                        className="mt-3" 
                        style={{
                            backgroundColor: predictionResult.color, 
                            color: predictionResult.textColor, 
                            padding: '10px', 
                            borderRadius: '5px',
                            textAlign: 'center'
                        }}
                    >
                        {predictionResult.text}
                    </div>
                )}
                <Link to="/" className="btn btn-secondary mx-2 mt-4">Volver al Inicio</Link>
            </div>
        </>
    );
}

export default CameraPage;

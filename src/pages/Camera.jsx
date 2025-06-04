import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { guardarResiduo as guardarResiduoAPI } from '../api';

function CameraPage() {
    const URL = "https://teachablemachine.withgoogle.com/models/1ep6Tneuh/";
    const [model, setModel] = useState(null);
    const [maxPredictions, setMaxPredictions] = useState(0);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [webcam, setWebcam] = useState(null);
    const [predictionResult, setPredictionResult] = useState({ text: "", tipo: "", color: "", textColor: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

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
        if (!model) return;

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

        const mapClassToTipo = {
            "Blanco": { text: "Contenedor Blanco", tipo: "Reciclable", color: "grey", textColor: "black" },
            "Negro": { text: "Contenedor Negro", tipo: "No reciclable", color: "black", textColor: "white" },
            "Verde": { text: "Contenedor Verde", tipo: "Orgánico", color: "green", textColor: "white" }
        };

        return mapClassToTipo[highest.className] || {
            text: "Desconocido", tipo: "Desconocido", color: "red", textColor: "white"
        };
    }

    async function predict(image) {
        if (!model) return;

        const prediction = await model.predict(image);
        const { text, tipo, color, textColor } = getContainerLabel(prediction);
        setPredictionResult({ text, tipo, color, textColor });
    }

    async function guardarResiduo() {
        if (!predictionResult.tipo || predictionResult.tipo === "Desconocido") return;

        setIsSaving(true);
        try {
            await guardarResiduoAPI("Residuo desde cámara", predictionResult.tipo);
            setSaveMessage("Residuo guardado correctamente 🎉");
        } catch (error) {
            console.error("Error al guardar:", error);
            setSaveMessage("Error al guardar el residuo 😢");
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(""), 3000);
        }
    }

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
                        Coloca el residuo frente a la cámara para clasificar.
                    </p>

                    <button
                        type="button"
                        onClick={initWebcam}
                        className="btn btn-success btn-lg mb-4"
                        disabled={isModelLoading || webcam !== null}
                    >
                        📷 Encender Cámara
                    </button>

                    {isModelLoading && <p className="text-muted">Cargando modelo...</p>}

                    <div id="webcam-container" className="d-flex justify-content-center mb-3"></div>

                    {predictionResult.text && (
                        <div
                            className="mt-3 p-3 rounded shadow"
                            style={{
                                backgroundColor: predictionResult.color,
                                color: predictionResult.textColor,
                                maxWidth: "400px",
                                margin: "0 auto"
                            }}
                        >
                            <strong>{predictionResult.text}</strong>
                        </div>
                    )}

                    {predictionResult.text && (
                        <div className="d-flex flex-column align-items-center mt-3">
                            <button
                                onClick={guardarResiduo}
                                className="btn btn-primary mb-3"
                                disabled={isSaving}
                            >
                                {isSaving ? "Guardando..." : "📦 Capturar Residuo"}
                            </button>

                            <Link to="/" className="btn btn-secondary">🏠 Volver al Inicio</Link>
                        </div>
                    )}

                    {saveMessage && (
                        <p
                            className="mt-3 fw-semibold"
                            style={{
                                color: saveMessage.includes("correctamente") ? "green" : "red",
                                transition: "opacity 0.5s ease"
                            }}
                        >
                            {saveMessage}
                        </p>
                    )}
                </div>
            </div>
        </>

    );
}

export default CameraPage;

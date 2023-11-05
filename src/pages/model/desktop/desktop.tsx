
import React, { useRef, useEffect } from "react";

import {
    ModelViewerElement,
    InfoContainer,
    SolidPorcelainData,
    cameraResetIcon,
    modelBgImage
} from "../common";

export const SingleModelPageForDesktop = (props: { id: string, data: SolidPorcelainData, isReady: boolean }) => {
    const modelViewerId = "hj-model-viewer" + props.id.replace(/\s/g, "-");
    
    // according to the docs https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-cameraOrbit
    // the default value of cameraOrbit is "0deg 75deg 105%"
    const initialCameraOrbit = "0deg 75deg 105%";

    const resetModelViewCamera = () => {
        console.log("Resetting model-viewer camera");
        const modelViewer = document.querySelector(`#${modelViewerId}`) as ModelViewerElement;
        const initialRadius = Number(modelViewer.getAttribute("data-initial-radius"));
        const initialFov = Number(modelViewer.getAttribute("data-initial-fov"));

        console.log("Initial Radius", initialRadius);
        console.log("Initial FOV", initialFov);

        modelViewer.fieldOfView = `${initialFov}deg`;
        modelViewer.cameraOrbit = `0deg 75deg ${initialRadius}m`;
    };

    useEffect(() => {
        const modelViewer = document.querySelector(`#${modelViewerId}`) as ModelViewerElement;
        modelViewer.addEventListener("render-scale", () => {
            modelViewer.setAttribute("data-initial-radius", modelViewer.getCameraOrbit().radius.toString());
            modelViewer.setAttribute("data-initial-fov", modelViewer.getFieldOfView().toString());
        });
    }, [props.id]);
    
    return (
        <div className="single-page">
            <div className="content-container">
                <InfoContainer pageId="model-page" info={props.data} isReady={props.isReady} itemFrame={
                    <model-viewer
                        id={modelViewerId}
                        src={props.data.model}
                        style={{ backgroundImage: `url(${modelBgImage})` }}
                        poster={props.data.poster}
                        exposure={props.data.exposure ?? 1}
                        camera-orbit={initialCameraOrbit}
                        min-camera-orbit={"-Infinity 0deg auto"}
                        max-camera-orbit={"Infinity 180deg auto"}
                        interaction-prompt-threshold={0}
                        alt=""
                        camera-controls
                    >
                        <button 
                            type="button" id="camera-reset-button" 
                            className="btn" onClick={resetModelViewCamera}
                        >
                            <img src={cameraResetIcon} alt="" />
                        </button>
                    </model-viewer>
                } />
            </div>
        </div>
    )
};
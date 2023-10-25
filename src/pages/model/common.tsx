
import "@google/model-viewer";
import { ModelViewerElement } from "@google/model-viewer";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': ModelViewerAttributes;
        }

        interface ModelViewerAttributes {
            id?: string;
            style?: React.CSSProperties,
            children?: React.ReactNode;
            src: string;
            poster?: string;
            alt?: string;
            exposure?: number;
            load?: Function
        }
    }
}

import { InfoContainer } from "../../components";
import { SolidPorcelainData } from "../../interfaces";

import cameraResetIcon from "../../assets/icon-3d.svg";
import modelBgImage from "../../assets/model/image-model-bg.png";

export {
    ModelViewerElement,
    InfoContainer,
    SolidPorcelainData,
    cameraResetIcon,
    modelBgImage
}
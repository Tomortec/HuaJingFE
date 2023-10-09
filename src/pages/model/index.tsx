
import React from "react";

import {
    useLoaderData, 
    useParams,
} from "react-router-dom";

import "@google/model-viewer";
import { ModelViewerElement } from "@google/model-viewer";

import {
    Swiper,
    SwiperSlide,
    useSwiper,
} from "swiper/react";
import "swiper/scss";

import { gsap } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

import { SolidPorcelainData } from "../../interfaces";
import { Page } from "../page";
import { InfoContainer } from "../../components/info-container";
import { Popup } from "../../components/popup";
import { getAllPorcelainData } from "./api";
import "./index.scss";


declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': ModelViewerAttributes;
        }

        interface ModelViewerAttributes {
            id?: string;
            children?: React.ReactNode;
            src: string;
            poster?: string;
            alt?: string;
            exposure?: number;
        }
    }
}

export async function loader() {
    const data = await getAllPorcelainData();
    return data;
}

const SingleModelPage = (props: { id: string, data: SolidPorcelainData }) => {
    const modelViewerId = "hj-model-viewer" + props.id.replace(/\s/g, "-");
    const swiper = useSwiper();
    const transitionSpeed = 500; // in ms

    const resetModelViewCamera = () => {
        console.log("Resetting model-viewer camera");
        const modelViewer = document.querySelector(`#${modelViewerId}`) as ModelViewerElement;
        // according to the docs https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-cameraOrbit
        // the default value of cameraOrbit is "0deg 75deg 105%"
        modelViewer.cameraOrbit = "0deg 75deg 105%";
    };

    const toPrevPage = () => {
        swiper.slidePrev(transitionSpeed);
        gsap.to("#modelPage", { duration: transitionSpeed / 1000, scrollTo: 0 });
    };

    const toNextPage = () => {
        swiper.slideNext(transitionSpeed);
        gsap.to("#modelPage", { duration: transitionSpeed / 1000, scrollTo: 0 });
    };

    return (
        <div className="single-page">
            <h1>{props.data.title}</h1>

            <model-viewer
                id={modelViewerId}
                src={props.data.model}
                poster={props.data.poster}
                exposure={props.data.exposure ?? 1}
                alt=""
                camera-controls
            >
                <button 
                    type="button" id="camera-reset-button" 
                    className="btn" onClick={resetModelViewCamera}
                >
                    <i className="bi-arrow-repeat"></i>
                </button>
            </model-viewer>

            {
                swiper.slides.length > 1 &&
                <div className="navigation-container">
                    <button type="button" className="btn"
                        onClick={toPrevPage}
                    >
                        <i className="bi-caret-left-fill"></i>
                        上一个
                    </button>
                    <button type="button" className="btn"
                        onClick={toNextPage}
                    >
                        下一个
                        <i className="bi-caret-right-fill"></i>
                    </button>
                </div>
            }

            <InfoContainer info={props.data} />
        </div>
    )
};

export const ModelPage = () => {
    const allModelData = useLoaderData() as SolidPorcelainData[];
    const { modelId } = useParams();
    // if not found, `findIndex` will return -1
    // but Swiper accepts all numbers, for it will clamp the value to the right range
    const initialIndex = allModelData.findIndex(data => data.id == modelId);

    return (
        <Page pageName="modelPage" authNeeded={true}>
            <>
                <div>
                    <Swiper
                        initialSlide={initialIndex}
                        loop={true}
                        allowTouchMove={false}
                        spaceBetween={$(window).width() * 0.1}
                    >
                        {
                            allModelData.map((data, i) => (
                                <SwiperSlide key={i}>
                                    <SingleModelPage id={data.id} data={data} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
                <div className="popup-container">
                    <Popup popupId="modal-page" popupTitle="联系我们"
                        popupBody={
                            <h3>扫码添加微信，了解更多详情</h3>
                        }
                        triggerCaption={
                            <div>
                                <i className="bi-wechat"></i>
                                <span>了解更多</span>
                            </div>
                        }
                    ></Popup>
                </div>
            </>
        </Page>
    )
};
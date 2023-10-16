
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

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
import { SwiperNavigator } from "../../components/swiper-navigator";
import { Popup } from "../../components/popup";
import { getAllPorcelainData } from "./api";
import "./index.scss";

import cameraResetIcon from "../../assets/icon-3d.svg";
import modelBgImage from "../../assets/image-model-bg.png";

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
        }
    }
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
            <model-viewer
                id={modelViewerId}
                style={{ backgroundImage: `url(${modelBgImage})` }}
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
                    <img src={cameraResetIcon} alt="" />
                </button>
            </model-viewer>

            <div className="content-container">
                <SwiperNavigator title={props.data.title} buttonsNeeded
                    onSlideToPrev={toPrevPage} onSlideToNext={toNextPage} />
                <InfoContainer info={props.data} />
            </div>
        </div>
    )
};

export const ModelPage = () => {
    const { modelId } = useParams();
    const [allModelData, setAllModelData] = useState([] as SolidPorcelainData[]);
    const [initialIndex, setInitialIndex] = useState(0);

    useEffect(() => {
        getAllPorcelainData()
            .then((res) => {
                setAllModelData(res);    
                
                // if not found, `findIndex` will return -1
                // but Swiper accepts all numbers, for it will clamp the value to the right range
                setInitialIndex(res.findIndex(data => data.id == modelId))
            });
    }, []);

    return (
        <Page pageName="modelPage" authNeeded={true}>
            <>
                <div className="scrollable">
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
                            <>
                                <img src="https://placehold.co/400" alt="" />
                                <span>扫码添加微信，了解更多详情</span>
                            </>
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
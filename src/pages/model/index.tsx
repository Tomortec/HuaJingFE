
import React, { useEffect, useState, useRef } from "react";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { clamp } from "lodash";

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

import { SolidPorcelainData, defaultSolidPorcelainData } from "../../interfaces";
import { Page } from "../page";
import { InfoContainer, SwiperNavigator, Popup } from "../../components";
import { getAllPorcelainData, getAllPorcelainDataApiKey } from "./api";
import "./index.scss";

import cameraResetIcon from "../../assets/icon-3d.svg";
import modelBgImage from "../../assets/model/image-model-bg.png";
import wechatIcon from "../../assets/icon-wechat.svg";
import qrcodeImage from "../../assets/image-qrcode.png";

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

const SingleModelPage = (props: { id: string, data: SolidPorcelainData }) => {
    const modelViewerId = "hj-model-viewer" + props.id.replace(/\s/g, "-");
    const swiper = useSwiper();
    const transitionSpeed = 500; // in ms
    // according to the docs https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-cameraOrbit
    // the default value of cameraOrbit is "0deg 75deg 105%"
    const initialCameraOrbit = "0deg 75deg 350%";
    const touchStartPos = useRef([] as ({ x: number, y: number })[]);
    const translationDelta = useRef({x: 0, y: 0} as { x: number, y: number });

    const resetModelViewCamera = () => {
        console.log("Resetting model-viewer camera");
        const modelViewer = document.querySelector(`#${modelViewerId}`) as ModelViewerElement;
        const initialRadius = Number(modelViewer.getAttribute("data-initial-radius"));
        const initialFov = Number(modelViewer.getAttribute("data-initial-fov"));

        console.log("Initial Radius", initialRadius);
        console.log("Initial FOV", initialFov);

        modelViewer.fieldOfView = `${initialFov}deg`;
        modelViewer.cameraOrbit = `0deg 75deg ${initialRadius}m`;

        translationDelta.current.x = 0;
        translationDelta.current.y = 0;
        gsap.to(modelViewer, {
            x: 0,
            y: 0,
            duration: 0.5
        });
    };

    const handleTouchStartEvent = (e: React.TouchEvent) => {
        if(e.touches.length == 2) {
            touchStartPos.current = [{
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            }, {
                x: e.touches[1].clientX,
                y: e.touches[1].clientY
            }];
        }
    };

    const handlePanningEvent = (e: React.TouchEvent) => {
        if(e.touches.length == 2) {
            const deltaX1 = e.touches[0].clientX - touchStartPos.current[0].x,
                deltaY1 = e.touches[0].clientY - touchStartPos.current[0].y;
            const deltaX2 = e.touches[1].clientX - touchStartPos.current[1].x,
                deltaY2 = e.touches[1].clientY - touchStartPos.current[1].y;
            if(
                (deltaX1 / Math.abs(deltaX1) == deltaX2 / Math.abs(deltaX2)) &&
                (deltaY1 / Math.abs(deltaY1) == deltaY2 / Math.abs(deltaY2))
            ) {
                const modelViewer = document.querySelector(`#${modelViewerId}`) as ModelViewerElement;
                modelViewer.disableZoom = true;
                const initialRadius = Number(modelViewer.getAttribute("data-initial-radius"));
                const baseFactor = Math.max(modelViewer.getCameraOrbit().radius, initialRadius) * Math.log(modelViewer.getMaximumFieldOfView());
                const vw = $(window).width();
                const translationX = clamp(deltaX1 * baseFactor * 0.0005, vw * 0.01);
                const translationY = clamp(deltaY1 * baseFactor * 0.0005, vw * 0.01);
                if(Math.abs(translationX) < 0.5 && Math.abs(translationY) < 0.5) { return; }
                translationDelta.current.x = clamp(translationDelta.current.x + translationX, -0.5 * vw, 0.5 * vw);
                translationDelta.current.y = clamp(translationDelta.current.y + translationY, -0.5 * vw, 0.5 * vw);
                $(modelViewer).css({
                    transform: `translate(${translationDelta.current.x}px, ${translationDelta.current.y}px)`
                });
            }
        }
    };

    const handleTouchEndEvent = (e: React.TouchEvent) => {
        const modelViewer = document.querySelector(`#${modelViewerId}`) as ModelViewerElement;
        modelViewer.disableZoom = false;
    };

    const toPrevPage = () => {
        swiper.slidePrev(transitionSpeed);
        gsap.to("#modelPage", { duration: transitionSpeed / 1000, scrollTo: 0 });
    };

    const toNextPage = () => {
        swiper.slideNext(transitionSpeed);
        gsap.to("#modelPage", { duration: transitionSpeed / 1000, scrollTo: 0 });
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
            <div className="visible-port" 
                style={{ backgroundImage: `url(${modelBgImage})` }}
                onTouchStart={handleTouchStartEvent}
                onTouchMove={handlePanningEvent}
                onTouchEnd={handleTouchEndEvent}>
                <button 
                    type="button" id="camera-reset-button" 
                    className="btn" onClick={resetModelViewCamera}
                >
                    <img src={cameraResetIcon} alt="" />
                </button>
                <model-viewer
                    id={modelViewerId}
                    src={props.data.model}
                    poster={props.data.poster}
                    exposure={props.data.exposure ?? 1}
                    disable-pan
                    camera-orbit={initialCameraOrbit}
                    min-camera-orbit={"-Infinity 0deg 500%"}
                    max-camera-orbit={"Infinity 180deg 1000%"}
                    interaction-prompt-threshold={0}
                    alt=""
                    camera-controls
                ></model-viewer>
            </div>

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
    const [swiper, setSwiper] = useState(null);
    const { data: allModelData, status } = useQuery({
        queryKey: [getAllPorcelainDataApiKey],
        queryFn: () => getAllPorcelainData(),
        // if you are using `Array(3).fill` here, it will return a type of `any[]`
        // which confuses ts
        placeholderData: [defaultSolidPorcelainData, defaultSolidPorcelainData, defaultSolidPorcelainData],
        staleTime: Infinity
    });

    // https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata
    useEffect(() => {
        const targetIndex = allModelData ? allModelData.findIndex(data => data.id == modelId) : 0;
        if(swiper && swiper.activeIndex != targetIndex) {
            swiper.slideTo(targetIndex, 0);
            console.log(targetIndex);
        }
    }, [swiper, allModelData]);

    return (
        <Page pageName="modelPage" resetScroll>
            <>
                <div className="scrollable">
                    <Swiper
                        loop={true}
                        allowTouchMove={false}
                        spaceBetween={$(window).width() * 0.1}
                        onSwiper={(swiper) => setSwiper(swiper)}
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
                                <img src={qrcodeImage} alt="" />
                                <span>扫码添加公众号，了解更多详情</span>
                            </>
                        }
                        triggerCaption={
                            <div>
                                <img src={wechatIcon} alt="" />
                                <span>联系我们</span>
                            </div>
                        }
                    ></Popup>
                </div>
            </>
        </Page>
    )
};

export default ModelPage;
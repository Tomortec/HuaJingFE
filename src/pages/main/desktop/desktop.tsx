
import React from "react";
import {
    useNavigate
} from "react-router-dom";

import {
    Swiper,
    SwiperSlide
} from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/scss/navigation";

import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

import { ModelInfo } from "../common";
import modelBgImage from "../../../assets/home/desktop/image-home-model-bg.png";

const ModelLinkCard = (props: { info: ModelInfo, isReady: boolean }) => {
    const navigate = useNavigate();
    return (
        <div className="model-link-card">
            <ReactPlaceholder ready={props.isReady}
                showLoadingAnimation type="rect"
                style={{ width: "20rem", height: "20rem" }}>
                <img className="model-image" style={{ backgroundImage: `url(${modelBgImage})` }} src={props.info.image} alt="model-bg" />
            </ReactPlaceholder>
            <div className="model-info-container">
                <div className="model-title-container">
                    <ReactPlaceholder ready={props.isReady} 
                        showLoadingAnimation type="rect"
                        style={{ width: "8rem", height: "2rem" }}>
                        <span className="model-title" onClick={() => navigate(props.info.link)}>
                            {props.info.title}
                        </span>
                    </ReactPlaceholder>
                </div>
                <div className="container-column">
                    <div className="model-age">
                        <span className="header">年代</span>
                        <ReactPlaceholder ready={props.isReady}
                            showLoadingAnimation type="rect"
                            style={{ width: "4rem", height: "1.25rem" }}>
                            <span>{props.info.age}</span>
                        </ReactPlaceholder>
                    </div>
                    <div className="model-class">
                        <span className="header">品类</span>
                        <ReactPlaceholder ready={props.isReady}
                            showLoadingAnimation type="rect"
                            style={{ width: "4rem", height: "1.25rem" }}>
                            <span>{props.info.classification}</span>
                        </ReactPlaceholder>
                    </div>
                </div>
                <div className="model-description">
                    <span className="header">介绍</span>
                    <ReactPlaceholder ready={props.isReady}
                        showLoadingAnimation type="text"
                        style={{ width: "20rem", height: "5rem" }}>
                        <span>{props.info.descriptionText}</span>
                    </ReactPlaceholder>
                </div>
            </div>
        </div>
    )
};

export const ModelLinkCardForDesktop = (
    props: { info: ModelInfo[], isReady: boolean }
) => {
    return (
        <Swiper
            loop
            grabCursor
            speed={800}
            navigation={true}
            modules={[Navigation, Pagination]}
        >
            {
                props.info.map((info, i) => (
                    <SwiperSlide key={i}>
                        <ModelLinkCard info={info} isReady={props.isReady} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    )
};

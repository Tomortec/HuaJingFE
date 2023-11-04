
import React, { useState } from "react";
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

import { ModelInfo } from "../common";
import modelBgImage from "../../../assets/home/desktop/image-home-model-bg.png";

const ModelLinkCard = (props: { info: ModelInfo }) => {
    const navigate = useNavigate();
    return (
        <div className="model-link-card">
            <img className="model-image" style={{ backgroundImage: `url(${modelBgImage})` }}
                src={props.info.image} alt="" />
            <div className="model-info-container">
                <div className="model-title-container">
                    <span className="model-title" onClick={() => navigate(props.info.link)}>
                        {props.info.title}
                    </span>
                </div>
                <div className="container-column">
                    <div className="model-age">
                        <span className="header">年代</span>
                        <span>{props.info.age}</span>
                    </div>
                    <div className="model-class">
                        <span className="header">品类</span>
                        <span>{props.info.classification}</span>
                    </div>
                </div>
                <div className="model-description">
                    <span className="header">介绍</span>
                    <span>{props.info.descriptionText}</span>
                </div>
            </div>
        </div>
    )
};

export const ModelLinkCardForDesktop = (props: { info: ModelInfo[] }) => {
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
                        <ModelLinkCard info={info} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    )
};

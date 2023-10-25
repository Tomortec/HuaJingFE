
import React from "react";
import {
    useNavigate
} from "react-router-dom";

import { ModelInfo } from "../common";
import modelBgImage from "../../../assets/home/image-home-model-bg.png";

const ModelLinkCard = (props: { info: ModelInfo }) => {
    const navigate = useNavigate();
    return (
        <div className="model-link-card"
            style={{ 
                backgroundImage: `url(${modelBgImage})`, 
                flexDirection: props.info.reversed ? "row-reverse" : "row"
            }}
            onClick={() => navigate(props.info.link)}>
            <img src={props.info.image} alt="" />
            <div className="text-container">
                <span className="header">{props.info.title}</span>
                <span className="content">
                    <span>年代</span>
                    <span>{props.info.age}</span>
                </span>
                <span className="content">
                    <span>品类</span>
                    <span>{props.info.classification}</span>
                </span>
                <span className="learn-more-btn">了解更多</span>
            </div>
        </div>
    )
};

export const ModelLinkCardForMobile = (props: { info: ModelInfo[] }) => {
    return (
        <>
            {
                props.info.map((info, i) => (
                    <ModelLinkCard info={info} key={i} />
                ))
            }
        </>
    )
};
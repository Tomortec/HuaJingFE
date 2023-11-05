
import React from "react";
import {
    useNavigate
} from "react-router-dom";

import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

import { ModelInfo } from "../common";
import modelBgImage from "../../../assets/home/image-home-model-bg.png";

const ModelLinkCard = (props: { info: ModelInfo, isReady: boolean }) => {
    const navigate = useNavigate();
    return (
        <div className="model-link-card"
            style={{ 
                backgroundImage: `url(${modelBgImage})`, 
                flexDirection: props.info.reversed ? "row-reverse" : "row"
            }}
            onClick={() => navigate(props.info.link)}>
            <ReactPlaceholder ready={props.isReady}
                showLoadingAnimation type="rect"
                style={{ minWidth: "40vw", height: "40vw" }}>
                <img src={props.info.image} alt="" />
            </ReactPlaceholder>
            <div className="text-container">
                <ReactPlaceholder ready={props.isReady}
                    showLoadingAnimation type="rect"
                    style={{ width: "8rem", height: "1.75rem" }}>
                    <span className="header">{props.info.title}</span>
                </ReactPlaceholder>
                <span className="content">
                    <span>年代</span>
                    <ReactPlaceholder ready={props.isReady}
                        showLoadingAnimation type="rect"
                        style={{ width: "4rem", height: "1.25rem" }}>
                        <span>{props.info.age}</span>
                    </ReactPlaceholder>
                </span>
                <span className="content">
                    <span>品类</span>
                    <ReactPlaceholder ready={props.isReady}
                        showLoadingAnimation type="rect"
                        style={{ width: "4rem", height: "1.25rem" }}>
                        <span>{props.info.classification}</span>
                    </ReactPlaceholder>
                </span>
                <span className="learn-more-btn">了解更多</span>
            </div>
        </div>
    )
};

export const ModelLinkCardForMobile = (props: { info: ModelInfo[], isReady: boolean }) => {
    return (
        <>
            {
                props.info.map((info, i) => (
                    <ModelLinkCard info={info} key={i} isReady={props.isReady} />
                ))
            }
        </>
    )
};

import React from "react";

import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

import { PorcelainData, defaultPorcelainData } from "../interfaces";
import { useDesktop } from "../hooks/useDesktop";

import { Popup } from "./popup";

import ageIcon from "../assets/icon-clock.svg";
import classIcon from "../assets/icon-classification.svg";
import bottomStampIcon from "../assets/icon-stamp.svg";
import sizeIcon from "../assets/icon-list.svg";
import wechatIcon from "../assets/icon-wechat.svg";
import qrcodeImage from "../assets/image-qrcode.png";

const BasicInfoTextComponent = (
    props: { 
        icon: string, title: string, 
        text: string, shouldAlignLeft?: boolean,
        isReady: boolean
    }
) => {
    return (
        <div className="basic-info">
            <div className="header" style={props.shouldAlignLeft ? { "justifyContent": "flex-start" } : {}}>
                { 
                    props.icon.startsWith("bi") ? 
                    <i className={props.icon}></i> :
                    <img src={props.icon} alt="" />
                }
                <span>{props.title}</span>
            </div>
            <ReactPlaceholder ready={props.isReady}
                showLoadingAnimation type="rect"
                style={{ width: "100%", height: "1.25rem" }}>
                <span className="content" style={props.shouldAlignLeft ? { "textAlign": "left" } : {}}>{props.text}</span>
            </ReactPlaceholder>
        </div>
    )
};

const QRCodePopup = (props: { pageId: string }) => {
    return (
        <Popup popupId={props.pageId} popupTitle="联系我们"
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
    )
};

export const InfoContainer = (props: { 
    pageId: string,
    info: PorcelainData,
    itemFrame?: React.ReactElement,
    isReady: boolean
}) => {
    const data = Object.assign({}, defaultPorcelainData, props.info);
    const isDesktop = useDesktop();

    return (
        <div className="info-container">
            <div className="top-frame-container">
                { isDesktop && <div className="frame-container">{ props.itemFrame }</div> }
                <div className="basic-info-container">
                    { isDesktop && <span className="basic-info-title zh-serif-text">{data.title}</span> }
                    <BasicInfoTextComponent icon={ageIcon} title="年代" text={data.age} isReady={props.isReady} />
                    <BasicInfoTextComponent icon={classIcon} title="品类" text={data.classification} isReady={props.isReady} />
                    <BasicInfoTextComponent icon={bottomStampIcon} title="底款" text={data.bottomStamp} isReady={props.isReady} />
                    <BasicInfoTextComponent icon={sizeIcon} title="尺寸说明" text={data.sizeIntroduction} shouldAlignLeft isReady={props.isReady} />
                    { isDesktop && <QRCodePopup pageId={props.pageId} /> }
                </div>
            </div>

            <div className="description-container">
                <span className="header">介绍</span>
                <ReactPlaceholder ready={props.isReady}
                    showLoadingAnimation type="rect"
                    style={{ width: "100%", height: "400px" }}>
                    {
                        ( props.info.description && props.info.description.startsWith("https")) ?
                        <img className="content" src={props.info.description} alt="" /> :
                        <pre className="content">{props.info.description}</pre>
                    }
                </ReactPlaceholder>
            </div>
        </div>
    )
};
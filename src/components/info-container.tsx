
import React from "react";

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
    props: { icon: string, title: string, text: string, shouldAlignLeft?: boolean }
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
            <span className="content" style={props.shouldAlignLeft ? { "textAlign": "left" } : {}}>{props.text}</span>
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
    itemFrame?: React.ReactElement 
}) => {
    const data = Object.assign({}, defaultPorcelainData, props.info);
    const isDesktop = useDesktop();

    return (
        <div className="info-container">
            <div className="top-frame-container">
                { isDesktop && <div className="frame-container">{ props.itemFrame }</div> }
                <div className="basic-info-container">
                    { isDesktop && <span className="basic-info-title">{data.title}</span> }
                    <BasicInfoTextComponent icon={ageIcon} title="年代" text={data.age} />
                    <BasicInfoTextComponent icon={classIcon} title="品类" text={data.classification} />
                    <BasicInfoTextComponent icon={bottomStampIcon} title="底款" text={data.bottomStamp} />
                    <BasicInfoTextComponent icon={sizeIcon} title="尺寸说明" text={data.sizeIntroduction} shouldAlignLeft />
                    { isDesktop && <QRCodePopup pageId={props.pageId} /> }
                </div>
            </div>

            <div className="description-container">
                <span className="header">介绍</span>
                {
                   ( props.info.description && props.info.description.startsWith("https")) ?
                   <img className="content" src={props.info.description} alt="" /> :
                   <pre className="content">{props.info.description}</pre>
                }
            </div>
        </div>
    )
};

import React from "react";

import { PorcelainData, defaultPorcelainData } from "../interfaces";

import ageIcon from "../assets/icon-clock.svg";
import classIcon from "../assets/icon-classification.svg";
import bottomStampIcon from "../assets/icon-diamond.svg";
import sizeIcon from "../assets/icon-list.svg";

const BasicInfoTextComponent = (
    props: { icon: string, title: string, text: string }
) => {
    return (
        <div className="basic-info">
            <div className="header">
                { 
                    props.icon.startsWith("bi") ? 
                    <i className={props.icon}></i> :
                    <img src={props.icon} alt="" />
                }
                <span>{props.title}</span>
            </div>
            <span className="content">{props.text}</span>
        </div>
    )
};

export const InfoContainer = (props: { info: PorcelainData }) => {
    const data = Object.assign({}, defaultPorcelainData, props.info);

    return (
        <div className="info-container">
            <div className="basic-info-container">
                <BasicInfoTextComponent icon={ageIcon} title="年代" text={data.age} />
                <BasicInfoTextComponent icon={classIcon} title="品类" text={data.classification} />
                <BasicInfoTextComponent icon={bottomStampIcon} title="底款" text={data.bottomStamp} />
                <BasicInfoTextComponent icon={sizeIcon} title="尺寸介绍" text={data.sizeIntroduction} />
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
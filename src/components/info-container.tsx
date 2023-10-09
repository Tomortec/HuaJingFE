
import React from "react";

import { PorcelainData } from "../interfaces";

const InfoTextComponent = (
    props: { icon: string, title: string, text: string }
) => {
    return (
        <div>
            <div className="fw-bold mb-2">
                <i className={`${props.icon} me-1`}></i>
                <span>{props.title}</span>
            </div>
            <span>{props.text}</span>
        </div>
    )
};

export const InfoContainer = (props: { info: PorcelainData }) => {
    const data = Object.assign({}, {
        classification: "未知",
        bottomStamp: "未知",
        sizeIntroduction: "未知",
        description: "未知"
    }, props.info);

    return (
        <div className="info-container d-flex flex-column justify-contetn-center align-items-center gap-4">
            <div className="d-flex flex-row justify-content-between text-center">
                <InfoTextComponent icon="bi-clock" title="年代" text={data.age} />
                <InfoTextComponent icon="bi-hammer" title="瓷器品类" text={data.classification} />
                <InfoTextComponent icon="bi-gem" title="底款" text={data.bottomStamp} />
            </div>
            <InfoTextComponent icon="bi-rulers" title="尺寸介绍" text={data.sizeIntroduction} />
            <InfoTextComponent icon="bi-pencil" title="介绍" text={data.description} />
        </div>
    )
};
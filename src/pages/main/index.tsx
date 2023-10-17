
import React, { useLayoutEffect, useState } from "react";

import {
    useNavigate
} from "react-router-dom";

import { Page } from "../page";
import "./index.scss";

import logoImage from "../../assets/image-logo.png";
import instructionsBgImage from "../../assets/image-home-bg.png";
import learnMoreBtnBgImage from "../../assets/image-home-btn-bg.png";
import clubBannerImage from "../../assets/image-banner-club.png";
import lakeBannerImage from "../../assets/image-banner-lake.png";
import modelBgImage from "../../assets/image-home-model-bg.png";

const instructionsContent: string = `在远古时代，华夏文明\n作为龙的传人一直领先于世界\n华夏文明的神秘面纱`;

interface IntroductionInfo { name: string, image: string, link: string }
const introductionInfo: {
    [_: string]: IntroductionInfo
} = {
    "club": {
        name: "俱乐部",
        image: clubBannerImage,
        link: "/club"
    },
    "huaxia": {
        name: "华夏国际拍卖",
        image: "https://images.pexels.com/photos/18418020/pexels-photo-18418020.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
        link: "/huaxia"
    },
    "lake": {
        name: "雁栖湖",
        image: lakeBannerImage,
        link: "/lake"
    }
};

interface ModelInfo { 
    title: string, image: string, 
    link: string, age: string, 
    classification: string,
    reversed: boolean
}
const MODEL_INFO: ModelInfo[] = [
    {
        title: "花鸟纹四方瓶",
        age: "乾隆年间",
        classification: "彩粉瓷器",
        image: "https://placehold.co/400x600",
        link: "/model/0",
        reversed: true
    },
    {
        title: "花鸟纹四方瓶",
        age: "乾隆年间",
        classification: "彩粉瓷器",
        image: "https://placehold.co/400x600",
        link: "/model/1",
        reversed: false
    },
    {
        title: "花鸟纹四方瓶",
        age: "乾隆年间",
        classification: "彩粉瓷器",
        image: "https://placehold.co/400x600",
        link: "/model/2",
        reversed: true
    }
];

const SectionHeader = (props: { text: string, enText: string }) => {
    return (
        <div className="section-header">
            <span className="en-text">{props.enText}</span>
            <span className="text">{props.text}</span>
            <div className="divider"></div>
        </div>
    )
};

const IntroductionLinkCard = (props: { info: IntroductionInfo }) => {
    const navigate = useNavigate();
    return (
        <div className="introduction-link-card"
            style={{ backgroundImage: `url(${props.info.image})` }}
            onClick={() => navigate(props.info.link)} >
            <div className="text-container">
                <span className="header">华境</span>
                <span className="content">
                    {props.info.name}
                </span>
            </div>
        </div>
    )
};

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

export const MainPage = () => {
    const navigate = useNavigate();
    const [pageHeight, setPageHeight] = useState("100vh");

    useLayoutEffect(() => {
        setPageHeight(`${$(".page-container").height()}px`);
    }, []);

    return (
        <Page pageName="mainPage">
            <div>
                <div className="instructions-container" style={{ height: pageHeight, backgroundImage: `url(${instructionsBgImage})` }}>
                    <div className="welcome-title">
                        <div className="title-bg-image" style={{ backgroundImage: `url(${logoImage})` }}></div>
                        { "WELCOME".split("").map((l, i) => (<span key={i}>{l}</span>)) }
                    </div>
                    <div className="instructions-content"><pre>{instructionsContent}</pre></div>
                    <div className="learn-more-btn" 
                        style={{ backgroundImage: `url(${learnMoreBtnBgImage})` }}
                        onClick={() => navigate("/instructions")}>
                        <span>了解更多</span>
                    </div>
                </div>
                <div className="introduction-container">
                    {
                        Object.keys(introductionInfo).map((key: string, i) => (
                            <IntroductionLinkCard info={introductionInfo[key]} key={i} />
                        ))
                    }
                </div>
                <div className="model-container">
                    <SectionHeader text="数字臻品" enText="DIGITAL MASTERPIECE" />
                    {
                        MODEL_INFO.map((info, i) => (
                            <ModelLinkCard info={info} key={i} />
                        ))
                    }
                </div>
                <div className="roadmap-container">
                    <SectionHeader text="发展路线" enText="ROADMAP" />
                    <img src="https://placehold.co/400x800" alt="" />
                </div>
                <div className="footer">
                    <SectionHeader text="合作伙伴" enText="COOPERATION" />
                </div>
            </div>
        </Page>
    )
};
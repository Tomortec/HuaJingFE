
import React, { useLayoutEffect, useState, useRef, useEffect } from "react";

import {
    useNavigate
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Page } from "../page";
import { Roadmap, RoadmapItemData } from "../../components";
import {
    getAllSolidPorcelainData,
    getAllSolidPorcelainDataApiKey
} from "./api";
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
    /**
     * if reversed, the image will be on the right
     */
    reversed: boolean
}

const roadmapData: RoadmapItemData[] = [
    {
        header: "一",
        content: [
            "6幅臻品解析图",
            "免费数字化臻品观澜",
            "华境｜俱乐部",
            "华境｜臻品ID"
        ]
    },
    {
        header: "二",
        content: [
            "2K｜3D臻品观澜",
            "千件稀有臻品",
            "解析图｜臻品对比",
            "百件至尊臻品 十件殿堂级臻品"
        ]
    },
    {
        header: "三",
        content: [
            "华境｜社区",
            "华境｜碎片",
            "华境｜经纪人",
            "华境｜博物馆"
        ]
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
    const pageName = "mainPage";
    const navigate = useNavigate();
    const [pageHeight, setPageHeight] = useState("100vh");
    const roadmapRef = useRef(null);

    const { data: modelInfo } = useQuery({
        queryKey: [getAllSolidPorcelainDataApiKey],
        queryFn: () => getAllSolidPorcelainData(),
        select: (data) => (
            data.map((v, i): ModelInfo => ({
                title: v.title,
                image: v.poster ?? "",
                link: `/model/${v.id.toString() || "0"}`,
                age: v.age ?? "未知",
                classification: v.classification ?? "未知",
                reversed: i % 2 ? false : true
            }))
        ),
        placeholderData: [],
        staleTime: Infinity
    });

    useLayoutEffect(() => {
        setPageHeight(`${$(".page-container").height()}px`);
    }, []);

    useEffect(() => {
        // wait for assets to load?
        setTimeout(() => {
            roadmapRef && roadmapRef.current.initializeRoadmap();
        }, 500);
    }, []);

    return (
        <Page pageName={pageName}>
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
                        modelInfo.map((info, i) => (
                            <ModelLinkCard info={info} key={i} />
                        ))
                    }
                </div>
                <div className="roadmap-container">
                    <SectionHeader text="发展路线" enText="ROADMAP" />
                    <Roadmap 
                        ref={roadmapRef}
                        roadmapId="hj-home-roadmap" 
                        scroller={`#${pageName}`} 
                        data={roadmapData} />
                </div>
                <div className="footer">
                    <SectionHeader text="合作伙伴" enText="COOPERATION" />
                </div>
            </div>
        </Page>
    )
};

export default MainPage;
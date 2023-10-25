
import React from "react";
import { useLayoutEffect, useState, useRef, useEffect } from "react";

import {
    useNavigate
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { Page } from "../page";
import { MediaWrapper } from "../../components";
import { DynamicImage, DynamicImageAnim, Roadmap, RoadmapItemData } from "../../components";
import { useDesktop } from "../../hooks/useDesktop";
import {
    getAllSolidPorcelainData,
    getAllSolidPorcelainDataApiKey
} from "./api";
import "./index.scss";

import { ModelInfo } from "./common";
import { ModelLinkCardForMobile } from "./mobile/mobile";
import { ModelLinkCardForDesktop } from "./desktop/desktop";

import logoImage from "../../assets/image-logo.png";
import instructionsBgImage from "../../assets/home/image-home-bg.png";
import instructionsBgImageForDesktop from "../../assets/home/desktop/image-home-bg.png";
import triArrowIcon from "../../assets/icon-tri-down-arrows.svg";
import learnMoreBtnBgImage from "../../assets/home/image-home-btn-bg.png";
import clubBannerImage from "../../assets/home/image-banner-club.png";
import huaxiaBannerImage from "../../assets/home/image-banner-huaxia.png";
import lakeBannerImage from "../../assets/home/image-banner-lake.png";
import clubBannerImageForDesktop from "../../assets/home/desktop/image-banner-club.png";
import huaxiaBannerImageForDesktop from "../../assets/home/desktop/image-banner-huaxia.png";
import lakeBannerImageForDesktop from "../../assets/home/desktop/image-banner-lake.png";
import qrcodeImage from "../../assets/image-qrcode.png";
import logoWallImage from "../../assets/home/image-logo-wall.png";
import logoWallImageForDesktop from "../../assets/home/desktop/image-logo-wall.png";

const instructionsContent: string = `自远古时代，华夏文明，作为龙的传人一直领先于世界\n随着时间推移，属于华夏文明的远古科技\n被极少数人所垄断，尘封于历史发展的长河中\n现在华境之门已打开，让我们一起寻找远古科技的故事，\n重新揭开那段属于华夏文明的神秘面纱。`;

interface IntroductionInfo { name: string, image: string, imageForDesktop: string, link: string }
const introductionInfo: {
    [_: string]: IntroductionInfo
} = {
    "club": {
        name: "我们是谁",
        image: clubBannerImage,
        imageForDesktop: clubBannerImageForDesktop,
        link: "/club"
    },
    "huaxia": {
        name: "华夏国际拍卖",
        image: huaxiaBannerImage,
        imageForDesktop: huaxiaBannerImageForDesktop,
        link: "/huaxia"
    },
    "lake": {
        name: "雁栖湖",
        image: lakeBannerImage,
        imageForDesktop: lakeBannerImageForDesktop,
        link: "/lake"
    }
};

const roadmapData: RoadmapItemData[] = [
    {
        header: "瓷",
        content: [
            "3个3D数字臻品",
            "收藏展示",
            "藏品解析",
            "拍卖会图鉴"
        ]
    },
    {
        header: "墨",
        content: [
            "2K 3D臻品",
            "千件数字化臻品",
            "百件至尊臻品",
            "十件殿堂级臻品",
            "解析图 对比功能"
        ]
    },
    {
        header: "境",
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
            <span className="en-text en-light-text">{props.enText}</span>
            <span className="text">{props.text}</span>
            <div className="divider"></div>
        </div>
    )
};

const IntroductionLinkCard = (props: { info: IntroductionInfo }) => {
    const navigate = useNavigate();
    const isDesktop = useDesktop();
    return (
        <div className="introduction-link-card"
            style={{ backgroundImage: `url(${isDesktop ? props.info.imageForDesktop : props.info.image})` }}
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

export const MainPage = () => {
    const pageName = "mainPage";
    const navigate = useNavigate();
    const [pageHeight, setPageHeight] = useState("100vh");
    const roadmapRef = useRef(null);

    const isDesktop = useDesktop();

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
            roadmapRef?.current?.initializeRoadmap();

            // first loaded
            const scrollOffset = window.localStorage.getItem(`SCROLL_${pageName}`);
            if(!scrollOffset || scrollOffset == "0") {
                $(".section-header").each((_, header) => {
                    gsap.from(header, {
                        opacity: 0,
                        y: "+=100",
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: header,
                            scroller: ".page-container",
                            start: "top 85%"
                        }
                    });
                });
            }
        }, 500);
    }, []);

    return (
        <Page pageName={pageName}>
            <div>
                <div className="instructions-container" style={{ height: pageHeight }}>
                    <DynamicImage src={isDesktop ? instructionsBgImageForDesktop : instructionsBgImage} classNames="instructions-bg" anim={DynamicImageAnim.FadeIn} />
                    <div className="welcome-title">
                        <div className="title-bg-image scale-up-anim" style={{ backgroundImage: `url(${logoImage})` }}></div>
                        { "WELCOME".split("").map((l, i) => (<span key={i}>{l}</span>)) }
                    </div>
                    <div className="instructions-content"><pre>{instructionsContent}</pre></div>
                    <div className="learn-more-btn scale-up-x-anim" 
                        style={{ backgroundImage: `url(${learnMoreBtnBgImage})` }}
                        onClick={() => navigate("/instructions")}>
                        <span>了解更多</span>
                    </div>
                    { isDesktop && <DynamicImage classNames="tri-arrow" src={triArrowIcon} anim={DynamicImageAnim.FadeIn} /> }
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
                    <div className="model-cards-container">
                        <MediaWrapper>
                            <ModelLinkCardForDesktop info={modelInfo} />
                            <ModelLinkCardForMobile info={modelInfo} />
                        </MediaWrapper>
                    </div>
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
                    <img className="logo-wall" src={isDesktop ? logoWallImageForDesktop : logoWallImage} />
                    <div className="qrcode-container">
                        <span>扫码添加公众号</span>
                        <img src={qrcodeImage} loading="lazy" />
                    </div>
                    <div className="footer-info-container">
                        <span>阿特姆科技（海南）有限公司 版权所有</span>
                        <a href="https://beian.miit.gov.cn" target="_blank">琼ICP备2023006172号-1</a>
                    </div>
                </div>
            </div>
        </Page>
    )
};

export default MainPage;
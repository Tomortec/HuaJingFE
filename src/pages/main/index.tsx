
import React, { ReactElement } from "react";

import {
    Link,
} from "react-router-dom";

import { Page } from "../page";
import "./index.scss";

const INSTRUCTIONS_CONTENT: string = `
   在远古时代，华夏文明，作为龙的传人一直领先于世界。
从独有的陶瓷到字面、玉器等艺术品，均体现了人类思想和工匠精神的知行合一，
系远古科技的代表佳作。每一件艺术作品中都包含了金新的“人造材料”，
井且是人类揭示大自然奥秘的主动探索行为和为如今的生活进步准备了必要的技术条件。
这些“远古科技”的佳作一直是帝王精选的审美与爱好，它不仅是帝王的象征，
也与远古时代的发展有若息息相关的联系和传承。随若时间推移，他们逐渐被人为的蒙上了神秘的等级色彩，
也被极少数的人所垄断，就这样远古科技尘封在历史发展的长河中···
<br><br>
   现在华境之门已打开，让我们一起寻找远古科技的故事，重新揭开那段属于华夏文明的神秘面纱。`
.replace(/(?:\r\n|\r|\n)/g, "")
.replace(/<br>/g, "\n");

interface IntroductionInfo { name: string, image: string, link: string }
const INTRODUCTION_INFO: {
    [_: string]: IntroductionInfo
} = {
    "club": {
        name: "俱乐部",
        image: "https://images.pexels.com/photos/5683351/pexels-photo-5683351.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
        link: "/club"
    },
    "huaxia": {
        name: "华夏国际拍卖",
        image: "https://images.pexels.com/photos/18418020/pexels-photo-18418020.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
        link: "/huaxia"
    },
    "lake": {
        name: "雁栖湖",
        image: "https://images.pexels.com/photos/15590299/pexels-photo-15590299.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
        link: "/lake"
    }
};

interface ModelInfo { 
    title: string, image: string, 
    link: string, age: string, 
    classification: string 
}
const MODEL_INFO: ModelInfo[] = [
    {
        title: "花鸟纹四方瓶",
        age: "乾隆年间",
        classification: "彩粉瓷器",
        image: "https://placehold.co/400",
        link: "/model/0"
    },
    {
        title: "青花瓷",
        age: "未知",
        classification: "未知",
        image: "https://placehold.co/400",
        link: "/model/1"
    },
    {
        title: "青花瓷（glTF）",
        age: "未知",
        classification: "未知",
        image: "https://placehold.co/400",
        link: "/model/2"
    }
];

const SectionHeader = (props: { text: string }) => {
    return (
        <div className="section-header">
            <span>{props.text}</span>
        </div>
    )
};

const Route = (props: {
    children: ReactElement | ReactElement[],
    to: string
}) => {
    // TODO: check if it is logged in

    return (
        <Link to={props.to}>
            {props.children}
        </Link>
    )
};

const IntroductionLinkCard = (props: { info: IntroductionInfo }) => {
    return (
        <Route to={props.info.link}>
            <div 
                className="introduction-link-card"
                style={{ backgroundImage: `url(${props.info.image})` }}
            >
                <span>{ `华境 ｜ ${props.info.name}` }</span>
            </div>
        </Route>
    )
};

const ModelLinkCard = (props: { info: ModelInfo }) => {
    return (
        <Route to={props.info.link}>
            <div className="model-link-card">
                <img src={props.info.image} alt="" />
                <div>
                    <h5>{props.info.title}</h5>
                    <span>{props.info.age}</span>
                    <span>{props.info.classification}</span>
                </div>
            </div>
        </Route>
    )
};

export const MainPage = () => {
    return (
        <Page pageName="mainPage">
            <div>
                <div className="video-container">
                    <video autoPlay={true} muted={true} preload="auto">
                        <source src="https://placehold.co/1920x1080.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="instructions-container horizon-space">
                    <SectionHeader text="欢迎进入华境" />
                    <pre>{ INSTRUCTIONS_CONTENT }</pre>
                    <Route to="/instructions">
                        <span>了解更多</span>
                        <i className="bi-caret-right"></i>
                    </Route>
                </div>
                <div className="introduction-container">
                    {
                        Object.keys(INTRODUCTION_INFO).map((key: string, i) => (
                            <IntroductionLinkCard info={INTRODUCTION_INFO[key]} key={i} />
                        ))
                    }
                </div>
                <div className="model-container horizon-space">
                    <SectionHeader text="数字臻品" />
                    {
                        MODEL_INFO.map((info, i) => (
                            <ModelLinkCard info={info} key={i} />
                        ))
                    }
                </div>
                <div className="roadmap-container horizon-space">
                    <SectionHeader text="ROADMAP" />
                    <img src="https://placehold.co/400x800" alt="" />
                </div>
                <div className="footer horizon-space">
                    <SectionHeader text="合作伙伴" />
                </div>
            </div>
        </Page>
    )
};
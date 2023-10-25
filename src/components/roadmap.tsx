
import React, { forwardRef, useImperativeHandle } from "react";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { isDevelopmentMode } from "../hooks/useDevelopmentMode";
import { useDesktop } from "../hooks/useDesktop";
gsap.registerPlugin(ScrollTrigger);

import roadmapBgImage from "../assets/home/image-roadmap-bg.png";
import roadmapBgImageForDesktop from "../assets/home/desktop/image-roadmap-bg.png";

export interface RoadmapItemData {
    header: string;
    content: string[];
}

const seriesNumber = ["壹", "贰", "叁", "肆"];

const RoadmapItem = (props: {
    data: RoadmapItemData,
    i: number
}) => {
    return (
        <div className="roadmap-item">
            <div className="header-container">
                <div className="series-num" style={props.i == 0 ? { backgroundColor: "darkred" } : {}}>
                    <span className="zh-serif-text">{seriesNumber[props.i] ?? ""}</span>
                </div>
                <div className="header zh-serif-text">
                    {props.data.header}
                </div>
            </div>
            <div className="content">
                <div className="bar"></div>
                {
                    props.data.content.map((content, i) => (
                        <div key={i} className="text-line">{content}</div>
                    ))
                }
            </div>
        </div>
    )
};

const createRoadmapAnimation = (tl: GSAPTimeline, data: RoadmapItemData[]) => {
    data.forEach((value, i) => {
        const label = `LABEL-${i}`;
        const item = `.roadmap-item:nth-of-type(${i + 1})`;
        tl.addLabel(label);

        tl.from(`${item} .header`, { delay: 0.8, autoAlpha: 0, duration: 0.8 }, label);
        tl.from(`${item} .series-num`, { autoAlpha: 0.0, duration: 0.8 }, label);

        tl.from(`${item} .bar`, {
            height: "0",
            duration: 0.8 * value.content.length,
            ease: "power1.in"
        }, label);

        value.content.forEach((_, j) => {
            // here is a `div.bar`, so 2 is added
            tl.from(`${item} .text-line:nth-of-type(${j + 2})`, {
                delay: () => 0.5 * j + 0.8,
                x: "200",
                alpha: 0,
                duration: 2.0
            }, label);
        });
    });
};

const createRoadmapAnimationForDesktop = (tl: GSAPTimeline, data: RoadmapItemData[]) => {
    data.forEach((value, i) => {
        const label = `LABEL-${i}`;
        const item = `.roadmap-item:nth-of-type(${i + 1})`;
        tl.addLabel(label);

        tl.from(`${item} .header`, { delay: 0.8, autoAlpha: 0, duration: 0.8 }, label);
        tl.from(`${item} .series-num`, { autoAlpha: 0.0, duration: 0.8 }, label);

        tl.from(`${item} .text-line`, {
            delay: () => 0.8,
            y: "200",
            alpha: 0,
            duration: 2.0,
            onStart: () => {
                tl.to(`.roadmap .bar`, {
                    duration: 2.0,
                    width: `${70 / 3 * (i + 1)}%`
                }, label);
            }
        }, label);
    });
};

export const Roadmap = forwardRef((props: {
    roadmapId: string,
    scroller: string,
    data: RoadmapItemData[]
}, ref) => {
    const isDesktop = useDesktop();

    useImperativeHandle(ref, () => ({
        initializeRoadmap() {
            const trigger = $(`#${props.roadmapId}`)[0];
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: trigger,
                    scroller: $(props.scroller)[0],
                    start: `${isDesktop ? "-50%" : "top"} 66%`,
                    end: `+=${$(trigger).height() * (isDesktop ? 0.5 : 0.75)}`,
                    fastScrollEnd: false,
                    snap: "labels",
                    scrub: 5,
                    once: isDesktop,
                }
            });
            isDesktop ? 
                createRoadmapAnimationForDesktop(tl, props.data) : 
                createRoadmapAnimation(tl, props.data);
            tl.addLabel("end");
        }
    }));

    return (
        <div id={props.roadmapId} className="roadmap">
            {
                props.data.map((v, i) => <RoadmapItem data={v} i={i} key={i} />)
            }
            { isDesktop && <div className="bar"></div> }
            <img className="roadmap-bg" src={isDesktop ? roadmapBgImageForDesktop : roadmapBgImage} alt="" />
        </div>
    )
});

import React, { forwardRef, useImperativeHandle } from "react";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { isDevelopmentMode } from "../hooks/useDevelopmentMode";
gsap.registerPlugin(ScrollTrigger);

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
                <div className="series-num">{seriesNumber[props.i] ?? ""}</div>
                <div className="header">
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

export const Roadmap = forwardRef((props: {
    roadmapId: string,
    scroller: string,
    data: RoadmapItemData[]
}, ref) => {
    useImperativeHandle(ref, () => ({
        initializeRoadmap() {
            const trigger = $(`#${props.roadmapId}`)[0];
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: trigger,
                    scroller: $(props.scroller)[0],
                    start: "top 66%",
                    end: `+=${$(trigger).height() * 0.75}`,
                    fastScrollEnd: false,
                    snap: "labels",
                    scrub: 5
                }
            });
            createRoadmapAnimation(tl, props.data);
            tl.addLabel("end");
        }
    }));

    return (
        <div id={props.roadmapId} className="roadmap">
            {
                props.data.map((v, i) => <RoadmapItem data={v} i={i} key={i} />)
            }
        </div>
    )
});

import React, { forwardRef, useImperativeHandle } from "react";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { isDevelopmentMode } from "../hooks/useDevelopmentMode";
gsap.registerPlugin(ScrollTrigger);

export interface RoadmapItemData {
    header: string;
    content: string[];
}

const RoadmapItem = (props: {
    data: RoadmapItemData
}) => {
    return (
        <div className="roadmap-item">
            <div className="header">{props.data.header}</div>
            <div className="content">
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
    data.forEach((v, i) => {
        const label = `LABEL-${i}`;
        const item = `.roadmap-item:nth-of-type(${i + 1})`;
        tl.addLabel(label);
        tl.from(`${item} .header`, { autoAlpha: 0, duration:0.8 }, label);

        v.content.forEach((_, j) => {
            tl.from(`${item} .text-line:nth-of-type(${j + 1})`, {
                x: "100",
                alpha: 0,
                duration: 0.8
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
                    start: "top center",
                    end: `+=${$(trigger).height() * 0.5}`,
                    fastScrollEnd: false,
                    snap: "labels",
                    scrub: 0.5,
                    markers: isDevelopmentMode().isDevelopment
                }
            });
            createRoadmapAnimation(tl, props.data);
            tl.addLabel("end");
        }
    }));

    return (
        <div id={props.roadmapId} className="roadmap">
            {
                props.data.map((v, i) => <RoadmapItem data={v} key={i} />)
            }
        </div>
    )
});
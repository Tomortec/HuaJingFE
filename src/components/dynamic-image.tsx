
import React from "react";

export enum DynamicImageAnim {
    FadeIn,
    ScaleUpFromCenter,
    ScaleXUp,
    SlideInFromBottom
}

const animMapper = (anim: DynamicImageAnim): { 
    "className": string,
    "initialStyle": React.CSSProperties 
} => {
    switch(anim) {
        case DynamicImageAnim.FadeIn:
            return {
                className: "fade-in-anim",
                initialStyle: { opacity: 0 }
            };
        case DynamicImageAnim.ScaleUpFromCenter:
            return {
                className: "scale-up-anim",
                initialStyle: { transform: "scale(0)", transformOrigin: "center" }
            };
        case DynamicImageAnim.ScaleXUp:
            return {
                className: "scale-up-x-anim",
                initialStyle: { transform: "scaleX(0)" }
            };
        case DynamicImageAnim.SlideInFromBottom:
            return {
                className: "slide-in-from-bottom-anim",
                initialStyle: { opacity: 0, transform: "translateY(30px)" }
            };
        default:
            return { className: "", initialStyle: {} }
    }
};

export const DynamicImage = (props: {
    src?: string,
    classNames?: string,
    anim: DynamicImageAnim,
    lazy?: boolean,
    fetchPriority?: "high" | "low"
}) => {
    const anim = animMapper(props.anim);
    return (
        props.src && 
        <img src={props.src} className={props.classNames ?? ""} alt="" 
            style={anim["initialStyle"]} loading={ props.lazy ? "lazy" : "eager" }
            fetchpriority={props.fetchPriority || "auto"}
            onLoad={(e) => e?.currentTarget?.classList?.add(anim["className"])} />
    )
};
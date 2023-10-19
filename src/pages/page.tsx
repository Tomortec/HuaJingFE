
import React, { useLayoutEffect, useState } from "react";

import {
    Navigate,
} from "react-router-dom";

import { gsap } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

import { useAuth } from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DynamicImage, DynamicImageAnim } from "../components";

interface PageProps {
    pageName: string;
    authNeeded?: boolean;
    resetScroll?: boolean;
    children?: JSX.Element;
    bgImage?: string;
}

export const Page = (props: PageProps) => {
    const { user } = useAuth();
    const [scrollState, setScrollState] = useLocalStorage(`SCROLL_${props.pageName}`, 0);

    useLayoutEffect(() => {
        if($("#hj-navbar").length) {
            const restHeight = $(window).height() - $("#hj-navbar").outerHeight();
            console.log(props.pageName, restHeight);
            $(".page-container").css({
                position: "absolute",
                top: $("#hj-navbar").outerHeight(),
                height: restHeight
            });

            $(".bg-image").css({ top: $("#hj-navbar").outerHeight() });
        }

        if(!props.resetScroll && (scrollState as number)) {
            gsap.to(`#${props.pageName}`, {
                scrollTo: scrollState as number,
                duration: 0.5
            });
        }

        return () => {
            const scrollTop = $(`#${props.pageName}`).scrollTop();
            setScrollState(scrollTop);
        }
    }, []);

    return (
        <>
            {
                props.authNeeded && !user ?
                <Navigate to={"/login"} /> :
                <div>
                    { props.bgImage && <DynamicImage src={props.bgImage} classNames="bg-image" anim={DynamicImageAnim.FadeIn} /> }
                    <div id={props.pageName} className="page-container">
                        {props.children}
                    </div>
                </div>
            }
        </>
    )
};

// export class Page extends React.Component<PageProps> {
//     constructor(props: PageProps) {
//         super(props);
//     }

//     componentDidMount() {
//         if(!$("#hj-navbar").length) return;

//         const restHeight = $(window).height() - $("#hj-navbar").outerHeight();
//         console.log(restHeight);
//         $(".page-container").css({
//             position: "absolute",
//             top: $("#hj-navbar").outerHeight(),
//             height: restHeight
//         });
//     }

//     render() {
//         return (
//             <div id={this.props.pageName} className="page-container">
//                 {this.props.children}
//             </div>
//         )
//     }
// }

import React, { useLayoutEffect } from "react";

import { gsap } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

import { useLocalStorage } from "../hooks/useLocalStorage";
import { useDesktop } from "../hooks/useDesktop";
import { DynamicImage, DynamicImageAnim } from "../components";

interface PageProps {
    pageName: string;
    resetScroll?: boolean;
    children?: JSX.Element;
    bgImage?: string;
    noTopPadding?: boolean;
}

export const Page = (props: PageProps) => {
    const [scrollState, setScrollState] = useLocalStorage(`SCROLL_${props.pageName}`, 0);
    const isDesktop = useDesktop();

    useLayoutEffect(() => {
        if($("#hj-navbar").length) {
            const restHeight = $(window).height() - $("#hj-navbar").outerHeight();
            console.log(props.pageName, restHeight);
            $(".page-container").css({
                position: "absolute",
                paddingTop: props.noTopPadding ? "0" : $("#hj-navbar").outerHeight(),
                height: "100vh"
            });

            $(".bg-image").css({ top: $("#hj-navbar").outerHeight() });
        }

        if(!props.resetScroll && !isDesktop && (scrollState as number)) {
            gsap.to(`#${props.pageName}`, {
                scrollTo: scrollState as number,
                duration: 0.0001,
                ease: "power2.out",
            });
        }

        return () => {
            const scrollTop = $(`#${props.pageName}`).scrollTop();
            setScrollState(scrollTop);
        }
    }, []);

    return (
        <>
            <div>
                { props.bgImage && <DynamicImage src={props.bgImage} classNames="page-bg-image" anim={DynamicImageAnim.FadeIn} /> }
                <div id={props.pageName} className="page-container">
                    {props.children}
                </div>
            </div>
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
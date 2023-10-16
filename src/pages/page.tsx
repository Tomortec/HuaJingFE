
import React, { useLayoutEffect } from "react";

import {
    Navigate,
} from "react-router-dom";

import { gsap } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

import { useAuth } from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface PageProps {
    pageName: string;
    authNeeded?: boolean;
    resetScroll?: boolean;
    children?: JSX.Element;
    bgImage?: string;
}

export const Page = (props: PageProps) => {
    const [scrollState, setScrollState] = useLocalStorage(`SCROLL_${props.pageName}`, null);

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
    });

    if(props.authNeeded) {
        const { user } = useAuth();
        if(!user) {
            return (
                <Navigate to={"/login"} />
            );
        }
    }

    return (
        <>
            { props.bgImage && <img className="bg-image" src={props.bgImage} alt="" /> } 
            <div id={props.pageName} className="page-container">
                {props.children}
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
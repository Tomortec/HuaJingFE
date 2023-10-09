
import React, { useEffect } from "react";

import {
    Navigate
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface PageProps {
    pageName: string;
    authNeeded?: boolean;
    children?: JSX.Element;
}

export const Page = (props: PageProps) => {
    useEffect(() => {
        if(!$("#hj-navbar").length) return;

        const restHeight = $(window).height() - $("#hj-navbar").outerHeight();
        console.log(restHeight);
        $(".page-container").css({
            position: "absolute",
            top: $("#hj-navbar").outerHeight(),
            height: restHeight
        });
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
        <div id={props.pageName} className="page-container">
            {props.children}
        </div>
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
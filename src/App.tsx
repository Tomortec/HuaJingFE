
import React, { useEffect } from "react";
import {
    useOutlet,
    useLocation,
} from "react-router-dom";

import { CSSTransition, SwitchTransition } from "react-transition-group";
import { createGlobalStyle } from "styled-components";
import wx from "weixin-js-sdk";

import { 
    Navbar,
    NavbarState
} from "./components";

import { isDevelopmentMode } from "./hooks/useDevelopmentMode";
import axios from "axios";

const SPECIAL_PATH_NAVBAR_STATE: {
    readonly [_ : string]: NavbarState
} = {
    "/user": NavbarState.UserDisabled,
    "/login": NavbarState.Hidden
};

const checkNavbarState = () => {
    const path = useLocation().pathname;
    return SPECIAL_PATH_NAVBAR_STATE[path] || NavbarState.Normal;
};

const fecthWXConfig = async (): Promise<{
    appId: string,
    timestamp: number,
    nonceStr: string,
    signature: string
}> => {
    try {
        const result = await axios.post("https://test.atmhn.cn/api/wechat/gen_sign", {
            "url": "https://test.atmhn.cn"
        });
        const resultData = result.data;
        const rawConfigData = resultData["data"];
        return rawConfigData ? {
            appId: rawConfigData["app_id"],
            nonceStr: rawConfigData["noncestr"],
            timestamp: rawConfigData["timestamp"],
            signature: rawConfigData["sign"]
        } : null;
    } catch(error) {
        console.error(error);
        return null;
    }
};

import ButlerWoff2 from "./assets/fonts/font-en-Butler-light.woff2";
import ButlerWoff from "./assets/fonts/font-en-Butler-light.woff";
import ButlerTrueType from "./assets/fonts/font-en-Butler-light.ttf";
 
const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: "Butler-Light";
        src: url(${ButlerWoff2}) format('woff2'),
            url(${ButlerWoff}) format('woff'),
            url(${ButlerTrueType}) format('truetype');
    }

    .en-light-text {
        font-family: "Butler-Light";
    }
`;

export const App = () => {
    const currentOutlet = useOutlet();
    const location = useLocation();

    useEffect(() => {
        // reset scroll position
        window.addEventListener("beforeunload", () => {
            Object.keys(window.localStorage).forEach((k) => {
                k.startsWith("SCROLL_") && window.localStorage.setItem(k, "0");
            });
        });
    }, []);

    useEffect(() => {
        const baseURL = isDevelopmentMode().isDevelopment ? 
            "https://ebbfcf54-9301-4d66-8be8-5a20d7cf90f9.mock.pstmn.io" : (
                isDevelopmentMode().isTesting ? "https://test.atmhn.cn" : ""
            );
        axios.defaults.baseURL = baseURL;
    }, []);

    return (
        <>
            <GlobalStyle />
            <Navbar state={checkNavbarState()} />
            <SwitchTransition>
                <CSSTransition
                    key={location.pathname}
                    timeout={500}
                    classNames={"page"}
                    unmountOnExit
                >
                    {currentOutlet}
                </CSSTransition>
            </SwitchTransition>
        </>
    )
};
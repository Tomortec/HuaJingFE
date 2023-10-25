
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
    NavbarState,
} from "./components";

import { useDesktop } from "./hooks/useDesktop";
import { isDevelopmentMode } from "./hooks/useDevelopmentMode";
import axios from "axios";

const mobileSpecialPathNavbarState: {
    readonly [_ : string]: NavbarState
} = {
    "/user": NavbarState.UserDisabled,
    "/login": NavbarState.Hidden
};

const checkNavbarState = (): NavbarState => {
    const path = useLocation().pathname;

    const isDesktop = useDesktop();
    if(isDesktop) {
        if(Object.keys(mobileSpecialPathNavbarState).includes(path)) {
            return NavbarState.UserDisabled;
        } else {
            return NavbarState.Normal;
        }
    }

    return mobileSpecialPathNavbarState[path] || NavbarState.Normal;
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
        !isDevelopmentMode().isDevelopment && fecthWXConfig()
            .then((config) => {
                console.log(config);

                if(!config) return;
                wx.config({
                    debug: true,
                    appId: config.appId,
                    timestamp: config.timestamp,
                    nonceStr: config.nonceStr,
                    signature: config.signature,
                    jsApiList: ["updateAppMessageShareData"]
                });

                wx.ready(() => {
                    wx.updateAppMessageShareData({
                        title: "华境-共享共建的艺术品数字化交流平台",
                        desc: "欢迎您加入华镜艺术品数字化交流平台！",
                        link: "https://test.atmhn.cn",
                        imgUrl: "",
                        success: () => { alert("Update WX message successfully!"); }
                    })
                }); 

                wx.error((error) => {
                    alert(error);
                    console.error(error);
                });
            });
    }, []);

    // useEffect(() => {
    //     const baseURL = isDevelopmentMode().isTesting ? "https://test.atmhn.cn" : ""
    //     axios.defaults.baseURL = baseURL;
    // }, []);

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
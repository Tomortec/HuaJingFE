
import React, { useEffect } from "react";
import {
    useOutlet,
    useLocation,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { CSSTransition, SwitchTransition } from "react-transition-group";
import { createGlobalStyle } from "styled-components";
import wx from "weixin-js-sdk";

import axios from "axios";
import log from "loglevel";
import remote from "loglevel-plugin-remote";

import { 
    Navbar,
    NavbarState,
    ErrorPage
} from "./components";

import { useDesktop } from "./hooks/useDesktop";
import { isDevelopmentMode } from "./hooks/useDevelopmentMode";
import logoImage from "./assets/image-logo.png";

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

const configRemoteLogger = () => {
    // TODO
    !isDevelopmentMode().isDevelopment && remote.apply(log, {
        url: "/api/log/console",
        level: "warn",
        format: (log) => ({
            timestamp: (new Date()).getTime(),
            level: log.level.label,
            message: log.message + `[${log.stacktrace}]`
        })
    }); 

    log.enableAll();
};

const fecthWXConfig = async (url: string): Promise<{
    appId: string,
    timestamp: number,
    nonceStr: string,
    signature: string,
}> => {
    try {
        const result = await axios.post("https://test.atmhn.cn/api/wechat/gen_sign", {
            "url": url
        });
        const resultData = result.data;
        log.info("fecthWXConfig", resultData);
        const rawConfigData = resultData["data"];
        return rawConfigData ? {
            appId: rawConfigData["app_id"],
            nonceStr: rawConfigData["noncestr"],
            timestamp: rawConfigData["timestamp"],
            signature: rawConfigData["sign"],
        } : null;
    } catch(error) {
        log.error(error);
        return null;
    }
};

import ButlerWoff2 from "./assets/fonts/font-en-Butler-light.woff2";
import ButlerWoff from "./assets/fonts/font-en-Butler-light.woff";
import ButlerTTF from "./assets/fonts/font-en-Butler-light.ttf";
import SourceHanWoff2 from "./assets/fonts/font-zh-SourceHan-semibold.woff2";
import SourceHanWoff from "./assets/fonts/font-zh-SourceHan-semibold.woff";
import SourceHanTTF from "./assets/fonts/font-zh-SourceHan-semibold.ttf";
import HiraginoWoff2 from "./assets/fonts/font-zh-Hiragino-w3.woff2";
import HiraginoWoff from "./assets/fonts/font-zh-Hiragino-w3.woff";
import HiraginoTTF from "./assets/fonts/font-zh-Hiragino-w3.ttf";
 
const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: "Butler-Light";
        src: local('Butler-Light'), local('Butler'),
            url(${ButlerWoff2}) format('woff2'),
            url(${ButlerWoff}) format('woff'),
            url(${ButlerTTF}) format('truetype');
    }

    .en-light-text {
        font-family: "Butler-Light";
    }

    @font-face {
        font-family: "SourceHan";
        src: local('SourceHanSerifCN-SemiBold'), local('思源宋体 CN Semibold'),
            url(${SourceHanWoff2}) format('woff2'),
            url(${SourceHanWoff}) format('woff'),
            url(${SourceHanTTF}) format('truetype');
    }

    .zh-serif-text {
        font-family: "SourceHan";
    }

    @font-face {
        font-family: "Hiragino";
        src: local('HiraginoSansGB-W3'), local('Hiragino Sans GB W3'),
            url(${HiraginoWoff2}) format('woff2'),
            url(${HiraginoWoff}) format('woff'),
            url(${HiraginoTTF}) format('truetype');
    }

    *, pre {
        font-family: "Hiragino";
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
        configRemoteLogger();
    }, []);

    useEffect(() => {
        const url = window.location.href.split("#")[0];
        fecthWXConfig(url)
            .then((config) => {
                if(!config) return;

                const apiList: wx.jsApiList = ["updateAppMessageShareData", "onMenuShareAppMessage"];
                wx.config({
                    debug: isDevelopmentMode().isDevelopment,
                    appId: config.appId,
                    timestamp: config.timestamp,
                    nonceStr: config.nonceStr,
                    signature: config.signature,
                    jsApiList: apiList
                });

                wx.ready(() => {
                    console.log("WX Config Ready");
                    wx.checkJsApi({
                        jsApiList: apiList,
                        success: (res) => {
                            if(res.checkResult["updateAppMessageShareData"]) {
                                wx.updateAppMessageShareData({
                                    title: "华境-共享共建的艺术品数字化交流平台",
                                    desc: "欢迎您加入华镜艺术品数字化交流平台！",
                                    link: url,
                                    imgUrl: logoImage,
                                    success: () => { console.log("Update WX message successfully!"); }
                                });
                            } else if(res.checkResult["onMenuShareAppMessage"]) {
                                wx.onMenuShareAppMessage({
                                    title: "华境-共享共建的艺术品数字化交流平台",
                                    desc: "欢迎您加入华镜艺术品数字化交流平台！",
                                    link: url,
                                    imgUrl: logoImage,
                                    success: () => { console.log("Update WX message successfully!"); },
                                    cancel: () => { console.log("WX Share Cancelled") }
                                });
                            }
                        }
                    });
                }); 

                wx.error((error) => {
                    // alert(error);
                    globalThis.log.error(error);
                });
            });
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
                    <ErrorBoundary FallbackComponent={ErrorPage}>
                        {currentOutlet}
                    </ErrorBoundary>
                </CSSTransition>
            </SwitchTransition>
        </>
    )
};
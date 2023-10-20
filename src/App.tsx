
import React, { useEffect } from "react";
import {
    useOutlet,
    useLocation,
} from "react-router-dom";

import { CSSTransition, SwitchTransition } from "react-transition-group";

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
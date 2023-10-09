
import React from "react";
import {
    Outlet,
    useLocation,
} from "react-router-dom";

import { 
    Navbar,
    NavbarState
} from "./components/navbar";

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
    return (
        <>
            <Navbar state={checkNavbarState()} />
            <Outlet />
        </>
    )
};
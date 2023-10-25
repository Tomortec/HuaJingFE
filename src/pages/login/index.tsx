
import React from "react";

import {
    Navigate,
    useNavigate
} from "react-router-dom";

import { Page } from "../page";
import { LoginForm } from "./common";

import "./index.scss";
import { useAuth } from "../../hooks/useAuth";
import { useDesktop } from "../../hooks/useDesktop";

import logoImage from "../../assets/image-logo.png";
import logoTitleImage from "../../assets/image-logo-title-large.png";
import posterBgImage from "../../assets/login/image-login-bg.png";
import desktopBgImage from "../../assets/login/desktop/image-login-bg.png";
import { DynamicImage, DynamicImageAnim } from "../../components";

export const LoginPage = () => {
    const { user, login } = useAuth();

    if(user) {
        console.log(`${user} has already logged`);
        return (
            <Navigate to={"/user"} />
        )
    }

    const navigate = useNavigate();
    const navigateToMainPage = () => navigate("/");

    const isDesktop = useDesktop();

    return (
        <Page pageName="loginPage" bgImage={ isDesktop ? desktopBgImage : "" }>
            <div>
                <div className="login-poster">
                    { !isDesktop && <DynamicImage src={posterBgImage} classNames="poster-image" anim={DynamicImageAnim.FadeIn} /> }
                    <div className="logo-container" onClick={navigateToMainPage}>
                        <DynamicImage src={logoImage} anim={DynamicImageAnim.ScaleUpFromCenter} />
                        <DynamicImage classNames="logo-title" src={logoTitleImage} anim={DynamicImageAnim.FadeIn} />
                    </div>
                </div>

                <LoginForm login={login} />
            </div>
        </Page>
    )
};

export default LoginPage;
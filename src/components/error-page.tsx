
import React from "react";
import { FallbackProps } from "react-error-boundary";
import { DynamicImage, DynamicImageAnim } from "./dynamic-image";
import { useAuth } from "../hooks/useAuth";

import errorImage from "../assets/user/image-user-empty.png";

export const ErrorPage = (props: FallbackProps) => {
    const { logout } = useAuth();

    const tryToResetError = () => {
        globalThis.log.error(props.error);
        logout();
        props.resetErrorBoundary();
    };

    return (
        <div className="error-page">
            <DynamicImage src={errorImage} anim={DynamicImageAnim.FadeIn} />
            <div className="text-container">
                <span>发生错误</span>
                <span>请点击下方按钮重试</span>
                <div className="btn" onClick={tryToResetError}>刷新</div>
            </div>
        </div>
    )
};

export default ErrorPage;

import React, { useRef, useState } from "react";

import {
    Navigate,
    useNavigate
} from "react-router-dom";

import Countdown from "react-countdown";

import { Page } from "../page";

import "./index.scss";
import { useAuth } from "../../hooks/useAuth";

import logoImage from "../../assets/image-logo.png";
import posterBgImage from "../../assets/login/image-login-bg.png";
import { requestForLoggingIn, requestVerificationCode } from "./api";
import { DynamicImage, DynamicImageAnim } from "../../components";

const phoneNumberRegex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$/;
const verificationCodeRegex = /^\d{6}$/;

export const LoginPage = () => {
    const { user, login } = useAuth();

    if(user) {
        console.log(`${user} has already logged`);
        return (
            <Navigate to={"/user"} />
        )
    }

    const [agreementChecked, setAgreementChecked] = useState(false);
    const [readyForRequestCode, setReadyForRequestCode] = useState(false);
    const phoneNumberInputRef = useRef(null);
    const vcodeInputRef = useRef(null);
    const [countdownDate, setCountdownDate] = useState<Date>(new Date());
    const countdownRef = useRef(null);

    const navigate = useNavigate();
    const navigateToMainPage = () => navigate("/");

    const countdownRenderer = ({ seconds, completed }) => {
        if(completed) {
            return (
                <button type="button" className="btn"
                    disabled={!readyForRequestCode}
                    onClick={requestForVerificationCode}>获取</button>
            );
        } else {
            return (
                <span className="btn">{seconds}s</span>
            )
        }
    };

    const requestForVerificationCode = () => {
        console.log("Start requesting for VCode");
        if(phoneNumberInputRef && phoneNumberRegex.test(phoneNumberInputRef.current.value)
            && countdownRef && countdownRef.current.isCompleted()) {
            setCountdownDate(new Date(Date.now() + 59000));
            requestVerificationCode(phoneNumberInputRef.current.value)
                .then((res) => console.log("Request VCode", res));
        }
    };

    const handlePhoneNumberInputFocused = (event: React.FormEvent<HTMLInputElement>) => {
        event.stopPropagation();
        $(event.currentTarget)
            .removeClass("invalid")
            .attr("placeholder", "请输入验证码");
    };

    const handlePhoneNumberInputChanged = (event: React.FormEvent<HTMLInputElement>) => {
        setReadyForRequestCode(phoneNumberRegex.test(event.currentTarget.value));
    };

    const handleAgreementCheckChanged = (event: React.FormEvent<HTMLInputElement>) => {
        setAgreementChecked(event.currentTarget.checked);
    };

    const handleSubmit = async () => {
        if(vcodeInputRef && verificationCodeRegex.test(vcodeInputRef.current.value)
            && phoneNumberInputRef && phoneNumberRegex.test(phoneNumberInputRef.current.value)) {
            const token = await requestForLoggingIn(
                phoneNumberInputRef.current.value, 
                vcodeInputRef.current.value
            );
            if(token) {
                login(token);
                return;
            }
        }
        console.log("Invalid vcode");
        $(vcodeInputRef.current)
            .addClass("invalid").val("")
            .attr("placeholder", "验证码错误").trigger("blur");
    };

    return (
        <Page pageName="loginPage">
            <div>
                <div className="login-poster">
                    <DynamicImage src={posterBgImage} classNames="poster-image" anim={DynamicImageAnim.FadeIn} />
                    <div className="logo-container" onClick={navigateToMainPage}>
                        <DynamicImage src={logoImage} anim={DynamicImageAnim.ScaleUpFromCenter} />
                        <span>华境｜HUAJING</span>
                    </div>
                </div>

                <div className="login-form">
                    <div>
                        <label htmlFor="phoneNumber" className="form-label">手机号</label>
                        <input type="text" ref={phoneNumberInputRef}
                            name="phoneNumber" className="form-control" 
                            placeholder="请输入手机号"
                            onChange={handlePhoneNumberInputChanged} />
                    </div>
                    <div>
                        <label htmlFor="verificationCode" className="form-label">验证码</label>
                        <div className="input-group">
                            <input type="number" ref={vcodeInputRef}
                                name="verificationCode" className="form-control"
                                placeholder="请输入验证码" autoComplete="off"
                                onFocus={handlePhoneNumberInputFocused}
                                disabled={!readyForRequestCode} />
                            <Countdown ref={countdownRef} date={countdownDate} key={countdownDate.getTime()}
                                renderer={countdownRenderer} />
                        </div>
                    </div>
                    <div>
                        <div className="form-check">
                            <input type="checkbox" id="agreementCheck" 
                                className="form-check-input" checked={agreementChecked}
                                onChange={handleAgreementCheckChanged} />
                            <label htmlFor="agreementCheck" className="form-label">同意用户协议</label>
                        </div>
                    </div>
                    <div>
                        <button 
                            type="button" className="submit-btn btn"
                            disabled={!(agreementChecked && readyForRequestCode)}
                            onClick={handleSubmit}
                        >登录</button>
                    </div>
                </div>
            </div>
        </Page>
    )
};

export default LoginPage;
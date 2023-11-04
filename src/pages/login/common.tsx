
import React, { useState, useRef } from "react";
import Countdown from "react-countdown";

import { requestForLoggingIn, requestVerificationCode } from "./api";

const phoneNumberRegex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$/;
const verificationCodeRegex = /^\d{6}$/;

const userAgreementText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`;

export const LoginForm = (props: {
    login: (token: string) => void
}) => {

    const [agreementChecked, setAgreementChecked] = useState(false);
    const [isShowingAgreement, setIsShowingAgreement] = useState(false);
    const [readyForRequestCode, setReadyForRequestCode] = useState(false);
    const phoneNumberInputRef = useRef(null);
    const vcodeInputRef = useRef(null);
    const [countdownDate, setCountdownDate] = useState<Date>(new Date());
    const countdownRef = useRef(null);
    const [isRequesting, setIsRequesting] = useState(false);

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
            setIsRequesting(true);
            const token = await requestForLoggingIn(
                phoneNumberInputRef.current.value, 
                vcodeInputRef.current.value
            );
            if(token) {
                props.login(token);
                return;
            }
            setIsRequesting(false);
        }
        console.log("Invalid vcode");
        $(vcodeInputRef.current)
            .addClass("invalid").val("")
            .attr("placeholder", "验证码错误").trigger("blur");
    };

    return (
        <div className="login-form">
            <div>
                <label htmlFor="phoneNumber" className="form-label">手机号</label>
                <input type="text" ref={phoneNumberInputRef} maxLength={20}
                    name="phoneNumber" className="form-control" 
                    placeholder="请输入手机号"
                    onChange={handlePhoneNumberInputChanged} />
            </div>
            <div>
                <label htmlFor="verificationCode" className="form-label">验证码</label>
                <div className="input-group">
                    <input type="text" inputMode="numeric" ref={vcodeInputRef} maxLength={6}
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
                    <label htmlFor="agreementCheck" className="form-label">
                        同意<a href="#" onClick={() => setIsShowingAgreement(true)}>用户协议</a>
                    </label>
                </div>
            </div>
            <div style={{ position: "relative" }}>
                { !agreementChecked && <div className="submit-btn-mask" onClick={() => alert("登录前请先阅读并勾选用户协议")}></div> }
                <button 
                    type="button" className="submit-btn btn"
                    disabled={!(agreementChecked && readyForRequestCode) || isRequesting}
                    onClick={handleSubmit}
                >登录</button>
            </div>

            {
                isShowingAgreement &&
                <div className="user-agreement-container">
                    <div className="mask" onClick={() => setIsShowingAgreement(false)}></div>
                    <div className="text-container">
                        <div className="header">用户协议</div>
                        <div className="content">{userAgreementText}</div>
                        <div className="agree-btn" onClick={() => { setAgreementChecked(true); setIsShowingAgreement(false) }}>同意协议</div>
                    </div>
                </div>
            }
        </div>
    )
};
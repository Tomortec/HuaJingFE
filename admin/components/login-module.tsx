
import React, { useState, useContext } from "react";

import { requestForLogginIn, requestVerificationCode } from "../api";
import { AuthContext } from "../hooks/authContext";

const phoneNumberRegex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$/;

export const LoginModule = () => {
    const { login } = useContext(AuthContext);
    const [loginId, setLoginId] = useState("");
    const [loginNumber, setLoginNumber] = useState("");
    const [disableVCodeBtn, setDisableVCodeBtn] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    const requestForVCode = async () => {
        if(!phoneNumberRegex.test(loginId)) {
            alert("手机号错误");
            return;
        }
        if(await requestVerificationCode(loginId)) {
            console.log("Request for vcode");
            setDisableVCodeBtn(true);
        }
    };

    const loginHandler = async () => {
        setIsRequesting(true);
        const token = await requestForLogginIn(loginId, loginNumber);
        if(token) {
            login({
                id: "0",
                phoneNumber: loginId,
                token: token
            });
        }
        setIsRequesting(false);
    };

    return (
        <div className="login-container">
            <div className="mb-3">
                <label htmlFor="login-id" className="form-label">手机号</label>
                <input type="text" id="login-id" 
                    className="form-control" value={loginId}
                    onChange={(e) => setLoginId(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="login-number" className="form-label">验证码</label>
                <div className="input-group">
                    <input type="number" id="login-number" 
                        className="form-control" value={loginNumber}
                        onChange={(e) => setLoginNumber(e.target.value)} />
                    <button className="btn btn-outline-secondary" 
                        type="button" disabled={disableVCodeBtn}
                        onClick={requestForVCode}>
                        获取
                    </button>
                </div>
            </div>
            <div className="mb-3">
                <button type="button" className="btn btn-primary"
                    disabled={isRequesting}
                    onClick={loginHandler}>登录</button>
            </div>
        </div>
    )
};
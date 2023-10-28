
import React, { useState, useContext } from "react";

import { requestForLogginIn, requestVerificationCode } from "../api";
import { AuthContext } from "../hooks/authContext";

export const LoginModule = () => {
    const { login } = useContext(AuthContext);
    const [loginId, setLoginId] = useState("");
    const [loginNumber, setLoginNumber] = useState("");
    const [disableVCodeBtn, setDisableVCodeBtn] = useState(false);

    const requestForVCode = async () => {
        console.log("Request for vcode");
        if(await requestVerificationCode(loginId)) {
            setDisableVCodeBtn(true);
        }
    };

    const loginHandler = async () => {
        const token = await requestForLogginIn(loginId, loginNumber);
        if(token) {
            login({
                id: "0",
                phoneNumber: loginId,
                token: token
            });
        }
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
                    onClick={loginHandler}>登录</button>
            </div>
        </div>
    )
};

import React, { MouseEvent } from "react";

import {
    Link, Navigate,
} from "react-router-dom";

import { Page } from "../page";

import "./index.scss";
import { useAuth } from "../../hooks/useAuth";

export const LoginPage = () => {
    const { user, login } = useAuth();

    if(user) {
        console.log(`${user} has already logged`);
        return (
            <Navigate to={"/user"} />
        )
    }

    const handleSubmit = () => {
        console.log("Login!");
        login();
    };

    return (
        <Page pageName="loginPage">
            <div>
                <div id="hj-login-poster">
                    <Link to={"/"}>
                        <i className="bi-person-circle"></i>
                    </Link>
                </div>

                <div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">手机号</label>
                        <input type="number" 
                            name="phoneNumber" className="form-control"
                            placeholder="请输入手机号" />
                        <div className="invalid-feedback">请输入正确手机号</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="verificationCode" className="form-label">验证码</label>
                        <div className="input-group">
                            <input type="number"
                                name="verificationCode" className="form-control"
                                placeholder="请输入验证码" />
                            <button type="button" className="btn btn-outline-secondary">获取验证码</button>
                        </div>
                    </div>
                    <div>
                        <button 
                            type="button" className="btn btn-primary"
                            onClick={handleSubmit}
                        >登录</button>
                    </div>
                </div>
            </div>
        </Page>
    )
};
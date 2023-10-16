
import React, { useState, useContext } from "react";

import { AuthContext } from "../hooks/authContext";

export const LoginModule = () => {
    const { login } = useContext(AuthContext);
    const [loginId, setLoginId] = useState("");
    const [loginNumber, setLoginNumber] = useState("");

    const loginHandler = () => {
        login({
            id: loginId,
            phoneNumber: loginNumber
        });
    };

    return (
        <div className="login-container">
            <div className="mb-3">
                <label htmlFor="login-id" className="form-label">ID</label>
                <input type="text" id="login-id" 
                    className="form-control" value={loginId}
                    onChange={(e) => setLoginId(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="login-number" className="form-label">手机号</label>
                <input type="number" id="login-number" 
                    className="form-control" value={loginNumber}
                    onChange={(e) => setLoginNumber(e.target.value)} />
            </div>
            <div className="mb-3">
                <button type="button" className="btn btn-primary"
                    onClick={loginHandler}>登录</button>
            </div>
        </div>
    )
};
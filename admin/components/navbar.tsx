
import React, { useContext } from "react";
import { AuthContext } from "../hooks/authContext";

export const Navbar = () => {
    const { auth } = useContext(AuthContext);

    const showAuthInfo = () => alert(`用户ID: ${auth.id}\n用户手机号: ${auth.phoneNumber}`);

    return (
        <nav id='hj-navbar' className='
            navbar navbar-expand-lg fixed-top bg-body-tertiary
            shadow-sm p-3 bg-white fs-3
        '>
            <div className='container-fluid'>
                <span>华境</span>
                <div className='d-flex'>
                    <i style={{ cursor: "pointer" }} className='bi-person-circle' 
                        onClick={showAuthInfo}></i>
                </div>
            </div>
        </nav>
    )
};
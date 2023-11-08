
import React from "react";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
    const { logout } = useAuth();

    const logoutAuth = () => {
        if(confirm("确定退出登录吗？")) {
            logout();
            window.location.reload();
        }
    };

    return (
        <nav id='hj-navbar' className='
            navbar navbar-expand-lg fixed-top bg-body-tertiary
            shadow-sm p-3 bg-white fs-3
        '>
            <div className='container-fluid'>
                <span>华境</span>
                <div className='d-flex'>
                    <i style={{ cursor: "pointer" }} className='bi-person-circle' 
                        onClick={logoutAuth}></i>
                </div>
            </div>
        </nav>
    )
};
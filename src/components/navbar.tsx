
import React from 'react';
import {
    useNavigate
} from "react-router-dom";

import logoImage from "../assets/image-logo.png";
import logoTitleImage from "../assets/image-logo-title.png";
import userIcon from "../assets/icon-user.svg";

export enum NavbarState {
    Normal,
    UserDisabled,
    Hidden
};

export const Navbar = (props: { state: NavbarState }) => {
    const navigate = useNavigate();

    return (
        <>
        {
            props.state != NavbarState.Hidden &&
            <nav id='hj-navbar' className='
                navbar navbar-expand-lg fixed-top
                shadow-sm
            '>
                <div className='container-fluid'>
                    <div className='navbar-brand mb-0 d-flex align-items-center' onClick={() => navigate("/")}>
                        <img src={logoImage} alt="" />
                        <img src={logoTitleImage} alt="" />
                    </div>
                    {
                        props.state != NavbarState.UserDisabled &&
                        <div className='d-flex' onClick={() => navigate("/user")}>
                            <img className='user-btn' src={userIcon} alt="" />
                        </div>
                    }
                </div>
            </nav>
        }
        </>
    )
};

export const StaticNavbar = () => {
    return (
        <nav id='hj-navbar' className='
            navbar navbar-expand-lg fixed-top
            shadow-sm
        '>
            <div className='container-fluid'>
                <div className='navbar-brand mb-0 d-flex align-items-center'>
                    <img src={logoImage} alt="" />
                    <span>华境｜HJ</span>
                </div>
                <div className='d-flex'>
                    <img className='user-btn' src={userIcon} alt="" />
                </div>
            </div>
        </nav>
    )
};
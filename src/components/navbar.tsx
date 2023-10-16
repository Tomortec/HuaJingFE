
import React from 'react';
import {
    Link,
} from "react-router-dom";

import logoImage from "../assets/image-logo.png";
import userIcon from "../assets/icon-user.svg";

export enum NavbarState {
    Normal,
    UserDisabled,
    Hidden
};

export const Navbar = (props: { state: NavbarState }) => {
    return (
        <>
        {
            props.state != NavbarState.Hidden &&
            <nav id='hj-navbar' className='
                navbar navbar-expand-lg fixed-top
                shadow-sm
            '>
                <div className='container-fluid'>
                    <Link className='navbar-brand mb-0 h1' to={"/"}>
                        <div className='d-flex align-items-center'>
                            <img src={logoImage} alt="" />
                            <span>华境｜HJ</span>
                        </div>
                    </Link>
                    {
                        props.state != NavbarState.UserDisabled &&
                        <Link className='d-flex' to={"/user"}>
                            <img className='user-btn' src={userIcon} alt="" />
                        </Link>
                    }
                </div>
            </nav>
        }
        </>
    )
};
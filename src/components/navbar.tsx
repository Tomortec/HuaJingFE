
import React from 'react';
import {
    Link,
} from "react-router-dom";

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
                navbar navbar-expand-lg fixed-top bg-body-tertiary
                shadow-sm p-3 bg-white
            '>
                <div className='container-fluid'>
                    <Link className='navbar-brand mb-0 h1' to={"/"}>华境</Link>
                    {
                        props.state != NavbarState.UserDisabled &&
                        <Link className='d-flex' to={"/user"}>
                            <i className='bi-person-circle'></i>
                        </Link>
                    }
                </div>
            </nav>
        }
        </>
    )
};
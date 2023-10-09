
import React from "react";

import {
    useLoaderData,
    Link,
} from "react-router-dom";

import {
    Page
} from "../page";

import {
    UserInfo,
    CollectionInfo,
    getUserInfo,
    getUserCollections
} from "./api";

import "./index.scss";
import { useAuth } from "../../hooks/useAuth";

interface UserPageData {
    userInfo: UserInfo;
    collections: CollectionInfo[];
}

export async function loader() {
    const userInfo = await getUserInfo();
    const collections = await getUserCollections();
    return { userInfo, collections };
}

const UserInfoComponent = (props: { info: UserInfo }) => {
    return (
        <>
            <span className="fw-bold">您好，尊敬的{props.info.username}</span>
            <div className="d-flex justify-contetn-center align-items-center gap-3">
                <img className="ratio ratio-1x1" src={props.info.avatar} alt="" />
                <div className="d-flex flex-column justify-content-start">
                    <span className="fs-4 fw-semibold">藏家｜{props.info.username}</span>
                    <span className="badge text-bg-danger">VIP {props.info.level}</span>
                </div>
            </div>
        </>
    )
};

const CollectionComponent = (props: { info: CollectionInfo }) => {
    return (
        <Link to={"/porcelain/0"}>
            <div className="d-flex justify-contetn-center align-items-center gap-4 mt-2 mb-3">
                <img className="ratio ratio-1x1" src={
                    props.info.image.length > 0 ?
                    props.info.image : 
                    "https://placehold.co/400"
                } alt="" />
                <div className="d-flex flex-column justify-content-start">
                    <span className="fs-5 fw-semibold">{props.info.title}</span>
                    <span>{props.info.age}</span>
                    <span>{props.info.classification}</span>
                </div>
            </div>
        </Link>
    )
};

export const UserPage = () => {
    const { userInfo, collections } = useLoaderData() as UserPageData;
    const { logout } = useAuth();

    return (
        <Page pageName="userPage" authNeeded={true}>
            <div>
                <div id="hj-user-info">
                    <UserInfoComponent info={userInfo} />
                </div>
                <div id="hj-user-collections">
                    <span className="h5">我的臻品</span>
                    {
                        collections.length > 0 ?
                        collections.map((info, i) => 
                            <CollectionComponent info={info} key={i}></CollectionComponent>
                        ) :
                        <i>暂无</i>
                    }
                </div>
                <div>
                    <button type="button" onClick={logout} className="btn btn-primary">
                        注销
                    </button>
                </div>
            </div>
        </Page>
    )
};
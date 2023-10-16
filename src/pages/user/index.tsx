
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserData, defaultUserData, CollectionData } from "../../interfaces";
import { useAuth } from "../../hooks/useAuth";
import { isDevelopmentMode } from "../../hooks/useDevelopmentMode";

import { getCollectionsData, getUserData } from "./api";

import { Page } from "../page";
import "./index.scss";

import userBgImage from "../../assets/image-user-bg.png";
import collectionBgImage from "../../assets/image-user-collection-bg.png";
import collectionEmptyImage from "../../assets/image-user-empty.png"

const UserInfoComponent = (props: { info: UserData }) => {
    return (
        <>
            <div className="avatar-container">
                <img src={props.info.avatar} alt="" />
                {/* <span className="badge">VIP{props.info.level}</span> */}
                { props.info.level > 0 && <span className="badge">VIP</span> }
            </div>
            <span className="name-container">{props.info.name}</span>
        </>
    )
};

const CollectionComponent = (props: { info: CollectionData }) => {
    const navigate = useNavigate();

    const navigateToPorcelainPage = () => {
        navigate(`/porcelain/${props.info.id}`);
    };

    return (
        <div className="collection-card" style={{ backgroundImage: `url(${collectionBgImage})` }}
            onClick={navigateToPorcelainPage}>
            <img src={props.info.image || "https://placehold.co/400x600"} alt="" />
            <span>{props.info.title}</span>
        </div>
    )
};

const EmptyCollectionPrompt = () => {
    return (
        <div className="empty-collection-prompt">
            <img src={collectionEmptyImage} alt="" />
            <span>暂无藏品</span>
        </div>
    )
};

export const UserPage = () => {
    const { user, logout } = useAuth();
    const [userInfo, setUserInfo] = useState(defaultUserData);
    const [collections, setCollections] = useState([] as CollectionData[]);

    useEffect(() => {
        getUserData(user)
            .then((res) => setUserInfo(res));

        getCollectionsData(user)
            .then((res) => setCollections(res));
    }, []);

    return (
        <Page pageName="userPage" authNeeded={true} bgImage={userBgImage}>
            <div>
                <div id="hj-user-info">
                    <UserInfoComponent info={userInfo} />
                </div>
                <div id="hj-user-collections">
                    <span className="collection-header">我的臻品</span>
                    {
                        collections.length > 0 ?
                        <div className="collections-container">
                        {
                            collections.map((info, i) => 
                                <CollectionComponent info={info} key={i}></CollectionComponent>
                            )
                        }
                        </div> :
                        <EmptyCollectionPrompt />
                    }
                </div>
                {
                    isDevelopmentMode().isDevelopment &&
                    <div>
                        <button type="button" onClick={logout} className="btn btn-primary">
                            注销
                        </button>
                    </div>
                }
            </div>
        </Page>
    )
};

import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

import { UserData, defaultUserData, CollectionData } from "../../interfaces";
import { useAuth } from "../../hooks/useAuth";
import { isDevelopmentMode } from "../../hooks/useDevelopmentMode";

import {
    getUserData, 
    getUserDataApiKey,

    getCollectionsData, 
    getCollectionsDataApiKey
} from "./api";

import { Page } from "../page";
import { DynamicImage, DynamicImageAnim } from "../../components";
import { useDesktop } from "../../hooks/useDesktop";
import "./index.scss";

import userBgImage from "../../assets/user/image-user-bg.png";
import userBgImageForDesktop from "../../assets/user/desktop/image-user-bg.png";
import collectionBgImage from "../../assets/user/image-user-collection-bg.png";
import collectionEmptyImage from "../../assets/user/image-user-empty.png"

const UserInfoComponent = (props: { info: UserData, isReady: boolean }) => {
    return (
        <>
            <div className="avatar-container">
                <DynamicImage src={props.info.avatar} anim={DynamicImageAnim.FadeIn} />
                {/* <span className="badge">VIP{props.info.level}</span> */}
                { props.info.level > 0 && <span className="badge">VIP</span> }
            </div>
            <ReactPlaceholder ready={props.isReady}
                showLoadingAnimation type="rect"
                style={{ width: "6rem", height: "1.5rem", marginRight: "0" }}>
                <span className="name-container">{props.info.name}</span>
            </ReactPlaceholder>
        </>
    )
};

const CollectionComponent = (props: { info: CollectionData }) => {
    const navigate = useNavigate();

    const navigateToPorcelainPage = () => {
        navigate(`/porcelain/${props.info.id}`);
    };

    return (
        <div className="collection-card slide-in-from-bottom-anim" style={{ backgroundImage: `url(${collectionBgImage})` }}
            onClick={navigateToPorcelainPage}>
            <img src={props.info.image || ""} alt="" />
            <span>{props.info.title}</span>
        </div>
    )
};

const EmptyCollectionPrompt = () => {
    return (
        <div className="empty-collection-prompt">
            <DynamicImage src={collectionEmptyImage} classNames="poster-image" anim={DynamicImageAnim.ScaleUpFromCenter} />
            <span>暂无藏品</span>
        </div>
    )
};

export const UserPage = () => {
    const { user, logout } = useAuth();

    const isDesktop = useDesktop();

    const { 
        data: userInfo, 
        isSuccess: isUserDataSuccess, 
        isPlaceholderData: isUserDataPlaceholder 
    } = useQuery({
        queryKey: [getUserDataApiKey],
        queryFn: () => getUserData(user),
        placeholderData: defaultUserData,
        staleTime: Infinity // https://stackoverflow.com/a/70294211/16835189
    });
    const { 
        data: collections, 
        isSuccess: isCollectionsDataSuccess,
        isPlaceholderData: isCollectionsDataPlaceholder
    } = useQuery({
        queryKey: [getCollectionsDataApiKey],
        queryFn: () => getCollectionsData(user),
        placeholderData: [],
        staleTime: 60 * 3000 // 3 mins
    });

    return (
        <Page pageName="userPage" bgImage={ isDesktop ? "" : userBgImage }>
            <>
                { isDesktop && <img className="bg-image" src={userBgImageForDesktop} alt="" /> }
                <div>
                    <div id="hj-user-info">
                        <UserInfoComponent info={userInfo} isReady={isUserDataSuccess && !isUserDataPlaceholder} />
                    </div>
                    <div id="hj-user-collections">
                        <span className="collection-header">我的藏品</span>
                        <ReactPlaceholder ready={isCollectionsDataSuccess && !isCollectionsDataPlaceholder}
                            showLoadingAnimation type="text" rows={5}
                            style={{ width: "100%", height: "400px", marginTop: "5vh" }}>
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
                        </ReactPlaceholder>
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
            </>
        </Page>
    )
};

export default UserPage;
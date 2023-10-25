
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    Swiper,
    SwiperSlide,
} from "swiper/react";
import "swiper/scss";

import { gsap } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

import { defaultSolidPorcelainData } from "../../interfaces";
import { Page } from "../page";
import { MediaWrapper, Popup } from "../../components";
import { getAllPorcelainData, getAllPorcelainDataApiKey } from "./api";
import { SingleModelPageForMobile } from "./mobile/mobile";
import { SingleModelPageForDesktop } from "./desktop/desktop";
import "./index.scss";

import wechatIcon from "../../assets/icon-wechat.svg";
import qrcodeImage from "../../assets/image-qrcode.png";

export const ModelPage = () => {
    const { modelId } = useParams();
    const [swiper, setSwiper] = useState(null);
    const { data: allModelData, status } = useQuery({
        queryKey: [getAllPorcelainDataApiKey],
        queryFn: () => getAllPorcelainData(),
        // if you are using `Array(3).fill` here, it will return a type of `any[]`
        // which confuses ts
        placeholderData: [defaultSolidPorcelainData, defaultSolidPorcelainData, defaultSolidPorcelainData],
        staleTime: Infinity
    });

    // https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata
    useEffect(() => {
        const targetIndex = allModelData ? allModelData.findIndex(data => data.id == modelId) : 0;
        if(swiper && swiper.activeIndex != targetIndex) {
            swiper.slideTo(targetIndex, 0);
            console.log(targetIndex);
        }
    }, [swiper, allModelData]);

    return (
        <Page pageName="modelPage" resetScroll>
            <>
                <div className="scrollable">
                    <Swiper
                        loop={true}
                        allowTouchMove={false}
                        spaceBetween={$(window).width() * 0.1}
                        onSwiper={(swiper) => setSwiper(swiper)}
                    >
                        {
                            allModelData.map((data, i) => (
                                <SwiperSlide key={i}>
                                    <MediaWrapper>
                                        <SingleModelPageForDesktop id={data.id} data={data} />
                                        <SingleModelPageForMobile id={data.id} data={data} />
                                    </MediaWrapper>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
                <div className="popup-container">
                    <Popup popupId="model-page" popupTitle="联系我们"
                        popupBody={
                            <>
                                <img src={qrcodeImage} alt="" />
                                <span>扫码添加公众号，了解更多详情</span>
                            </>
                        }
                        triggerCaption={
                            <div>
                                <img src={wechatIcon} alt="" />
                                <span>联系我们</span>
                            </div>
                        }
                    ></Popup>
                </div>
            </>
        </Page>
    )
};

export default ModelPage;
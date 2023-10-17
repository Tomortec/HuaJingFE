
import React from "react";

import {
    useLocation,
} from "react-router-dom";

import {
    Pagination,
    Autoplay,
} from "swiper/modules";

import {
    Swiper,
    SwiperSlide,
} from "swiper/react";
import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/scss/autoplay";

import { Page } from "../page";

import "./index.scss";

interface LocationConfiguration {
    readonly [pathName: string]: {
        readonly pageName: string;
        readonly title: string;
        readonly slides: string[];
        readonly introductionImage: string;
    }
};

const locationConfig: LocationConfiguration = {
    "/club": {
        "pageName": "clubPage",
        "title": "俱乐部",
        "slides": [
            "https://images.pexels.com/photos/5683351/pexels-photo-5683351.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
            "https://images.pexels.com/photos/18418020/pexels-photo-18418020.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
            "https://images.pexels.com/photos/15590299/pexels-photo-15590299.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        ],
        "introductionImage": "https://images.pexels.com/photos/18077633/pexels-photo-18077633.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
    },
    "/huaxia": {
        "pageName": "huaxiaPage",
        "title": "华夏国际拍卖",
        "slides": [""],
        "introductionImage": ""
    },
    "/lake": {
        "pageName": "lakePage",
        "title": "雁栖湖",
        "slides": [""],
        "introductionImage": ""
    }
};

export const IntroductionPage = () => {
    const pathName = useLocation().pathname;
    if(!introductionPagePaths.includes(pathName)) {
        return (
            <></>
        )
    }

    const config = locationConfig[pathName.toLowerCase()];

    return (
        <Page pageName={config.pageName} authNeeded={true}>
            <div>
                <h1>{config.title}</h1>
                <Swiper 
                    loop={true}
                    modules={[Pagination, Autoplay]}
                    pagination={{clickable: false}}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false // TODO: T/F?
                    }}
                >
                    {
                        config.slides.map((src, i) => (
                            <SwiperSlide key={i}>
                                <img className="slide-image" src={src} alt="" />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <img className="introdcution-image" src={config.introductionImage} alt="" />
            </div>
        </Page>
    )
};

export const introductionPagePaths = Object.keys(locationConfig);
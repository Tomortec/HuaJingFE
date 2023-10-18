
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
    Swiper,
    SwiperSlide
} from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/pagination";

import { defaultPlanePorcelainData } from "../../interfaces";
import { Page } from "../page";
import { InfoContainer, SwiperNavigator } from "../../components";
import { getPorcelainData } from "./api";
import "./index.scss";

import modelBgImage from "../../assets/image-model-bg.png";

export const PorcelainPage = () => {
    const { porcelainId } = useParams();
    const [data, setData] = useState(defaultPlanePorcelainData);

    useEffect(() => {
        getPorcelainData(porcelainId)
            .then((res) => setData(res));
    }, []);

    return (
        <Page pageName="porcelainPage" authNeeded={true} resetScroll>
            <div>
                <Swiper
                    modules={[Pagination, Autoplay]}
                    loop={true} speed={600}
                    spaceBetween={$(window).width() * 0.1}
                    autoplay={{ delay: 5000 }}
                    pagination={{ dynamicBullets: true, dynamicMainBullets: 3 }}
                >
                    {
                        data.images.length > 0 ?
                        data.images.map((src, i) => 
                            <SwiperSlide key={i} style={{ backgroundImage: `url(${modelBgImage})` }}>
                                <img src={src} alt="" />
                            </SwiperSlide>
                        ) :
                        <SwiperSlide>
                            <img src="https://placehold.co/400" alt="" />
                        </SwiperSlide>
                    }
                </Swiper>

                <div className="content-container">
                    <SwiperNavigator title={data.title} buttonsNeeded={false} />
                    <InfoContainer info={data} />
                </div>
            </div>
        </Page>
    )
};

import React from "react";

import {
    Swiper,
    SwiperSlide
} from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/pagination";

import { PlanePorcelainData } from "../../../interfaces";

import modelBgImage from "../../../assets/model/image-model-bg.png";

export const SwiperForMobile = (props: { data: PlanePorcelainData }) => {
    return (
        <Swiper
            modules={[Pagination, Autoplay]}
            loop={true} speed={600}
            spaceBetween={$(window).width() * 0.1}
            autoplay={{ delay: 5000 }}
            pagination={{ dynamicBullets: true, dynamicMainBullets: 3 }}
        >
            {
                props.data.images.length > 0 ?
                props.data.images.map((src, i) => 
                    <SwiperSlide key={i} style={{ backgroundImage: `url(${modelBgImage})` }}>
                        <img src={src} alt="" />
                    </SwiperSlide>
                ) :
                <SwiperSlide>
                    // TODO
                    <img src="https://placehold.co/400" alt="" />
                </SwiperSlide>
            }
        </Swiper>
    )
};
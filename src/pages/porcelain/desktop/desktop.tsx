
import React, { useEffect, useLayoutEffect, useState } from "react";

import {
    Swiper,
    SwiperClass,
    SwiperSlide
} from "swiper/react";
import { Navigation, Thumbs, Autoplay } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/thumbs";
import "swiper/scss/navigation";
import { PlanePorcelainData } from "../../../interfaces";

import downArrow from "../../../assets/icon-down-arrow.svg";
import porcelainBgImage from "../../../assets/model/desktop/image-porcelain-bg.png";

export const SwiperForDesktop = (props: { data: PlanePorcelainData }) => {
    const [imageSwiper, setImageSwiper] = useState<SwiperClass>(null);
    const [thumbnailSwiper, setThumbnailSwiper] = useState<SwiperClass>(null);

    useLayoutEffect(() => {
        const spaceBetween = $(".thumbnail-wrapper").height() - $(".thumbnail-wrapper img").height();
        $(".swiper-next-btn")
            .css("transform", `translateY(-${spaceBetween}px)`)
    });

    return (
        <>
            <div className="swiper-prev-btn" 
                style={{ backgroundImage: `url(${downArrow})` }}
                onClick={() => imageSwiper && imageSwiper.slidePrev()}
            ></div>
            <div className="swiper-next-btn" 
                style={{ backgroundImage: `url(${downArrow})` }}
                onClick={() => imageSwiper && imageSwiper.slideNext()}
            ></div>
            <div className="swiper-container">
                <Swiper 
                    className="thumbnail-swiper"
                    modules={[Navigation, Thumbs]}
                    loop watchSlidesProgress 
                    slideToClickedSlide grabCursor
                    direction="vertical"
                    slidesPerView={5}
                    onSwiper={(swiper) => setThumbnailSwiper(swiper)}
                >
                    {
                        props.data.images.map((src, i) => (
                            <SwiperSlide key={i}>
                                <div className="thumbnail-wrapper">
                                    <img draggable={false} src={src} alt="" />
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <Swiper
                    className="image-swiper"
                    style={{ backgroundImage: `url(${porcelainBgImage})` }}
                    modules={[Autoplay, Thumbs]}
                    loop grabCursor
                    direction="vertical"
                    slidesPerView={1} speed={600}
                    autoplay={{ delay: 5000 }}
                    thumbs={{ swiper: thumbnailSwiper }}
                    onSwiper={(swiper) => setImageSwiper(swiper) }
                >
                    {
                        props.data.images.map((src, i) => (
                            <SwiperSlide key={i}>
                                <img src={src} alt="" />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </>
    )
};
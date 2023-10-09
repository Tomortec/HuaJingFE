
import React from "react";

import {
    useLoaderData,
} from "react-router-dom";

import {
    Swiper,
    SwiperSlide,
} from "swiper/react";
import "swiper/scss";

import { PlanePorcelainData } from "../../interfaces";
import { Page } from "../page";
import { InfoContainer } from "../../components/info-container";
import { getPorcelainData } from "./api";
import "./index.scss";


export async function loader() {
    const data = await getPorcelainData();
    return data;
}

export const PorcelainPage = () => {
    const data = useLoaderData() as PlanePorcelainData;

    return (
        <Page pageName="porcelainPage" authNeeded={true}>
            <div>
                <h1>{data.title}</h1>
                <Swiper
                    loop={true}
                >
                    {
                        data.images.length > 0 ?
                        data.images.map((src, i) => 
                            <SwiperSlide key={i}>
                                <img src={src} alt="" />
                            </SwiperSlide>
                        ) :
                        <SwiperSlide>
                            <img src="https://placehold.co/400" alt="" />
                        </SwiperSlide>
                    }
                </Swiper>

                <InfoContainer info={data} />
            </div>
        </Page>
    )
};
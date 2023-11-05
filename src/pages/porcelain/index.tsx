
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { defaultPlanePorcelainData } from "../../interfaces";
import { Page } from "../page";
import { SwiperForMobile } from "./mobile/mobile";
import { SwiperForDesktop } from "./desktop/desktop";
import { InfoContainer, SwiperNavigator, MediaWrapper } from "../../components";
import { getPorcelainData } from "./api";
import { useDesktop } from "../../hooks/useDesktop";
import "./index.scss";

export const PorcelainPage = () => {
    const { porcelainId } = useParams();
    const [data, setData] = useState(defaultPlanePorcelainData);

    const [isReady, setIsReady] = useState(false);

    // TODO: the first time I'm not using `useQuery` here 
    // is for that I used to consider that the user may visit this page
    // too many times and causing large cache
    // BUT, I seems to be ok to cache the data here

    useEffect(() => {
        getPorcelainData(porcelainId)
            .then((res) => {
                setData(res);
                setIsReady(true);
            });
    }, []);

    const isDesktop = useDesktop();

    return (
        <Page pageName="porcelainPage" resetScroll>
            <div>
                {
                    !isDesktop &&
                    <div className="swiper-container">
                        <SwiperForMobile data={data} />
                    </div>
                }

                <div className="content-container">
                    {!isDesktop && <SwiperNavigator title={data.title} buttonsNeeded={false} /> }
                    <InfoContainer 
                        pageId="porcelain-page" 
                        info={data}
                        isReady={isReady}
                        itemFrame={isDesktop ? <SwiperForDesktop data={data} /> : null} />
                </div>
            </div>
        </Page>
    )
};

export default PorcelainPage;
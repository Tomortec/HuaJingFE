
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

    useEffect(() => {
        getPorcelainData(porcelainId)
            .then((res) => setData(res));
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
                        itemFrame={isDesktop ? <SwiperForDesktop data={data} /> : null} />
                </div>
            </div>
        </Page>
    )
};

export default PorcelainPage;
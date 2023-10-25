
import React from "react";
import { useLocation } from "react-router-dom";
import { range } from "lodash";

import { Page } from "../page";
import { DynamicImage, DynamicImageAnim } from "../../components";
import { useDesktop } from "../../hooks/useDesktop";

import "./index.scss";

interface LocationConfiguration {
    readonly [pathName: string]: {
        readonly name: string;
        readonly imageNum: number;
        readonly desktopImageNum: number;
    }
};

const locationConfig: LocationConfiguration = {
    "/club": {
        name: "club",
        imageNum: 2,
        desktopImageNum: 1
    },
    "/huaxia": {
        name: "huaxia",
        imageNum: 2,
        desktopImageNum: 1
    },
    "/lake": {
        name: "lake",
        imageNum: 2,
        desktopImageNum: 1
    }
};

export const IntroductionPage = () => {
    const pathName = useLocation().pathname;
    if(!introductionPagePaths.includes(pathName)) {
        return (
            <></>
        )
    }

    const isDesktop = useDesktop();
    const config = locationConfig[pathName.toLowerCase()];

    const imageNum = config[isDesktop ? "desktopImageNum" : "imageNum"];
    const imageDir = isDesktop ? "/desktop" : "";
    const noTopPadding = !isDesktop;

    return (
        <Page pageName={config.name + "Page"} noTopPadding={noTopPadding}>
            <div>
                {
                    range(imageNum).map((i) => (
                        <DynamicImage key={i} src={require(`../../assets/introduction${imageDir}/image-introduction-${config.name}-${i}.png`)}
                            anim={DynamicImageAnim.SlideInFromBottom} lazy />
                    ))
                }
            </div>
        </Page>
    )
};

export const introductionPagePaths = Object.keys(locationConfig);

export default IntroductionPage;
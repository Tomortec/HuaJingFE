
import React from "react";
import { useLocation } from "react-router-dom";
import { range } from "lodash";

import { Page } from "../page";
import { DynamicImage, DynamicImageAnim } from "../../components";

import "./index.scss";

interface LocationConfiguration {
    readonly [pathName: string]: {
        readonly name: string;
        readonly imageNum: number;
    }
};

const locationConfig: LocationConfiguration = {
    "/club": {
        name: "club",
        imageNum: 2,
    },
    "/huaxia": {
        name: "huaxia",
        imageNum: 2,
    },
    "/lake": {
        name: "lake",
        imageNum: 2,
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
        <Page pageName={config.name + "Page"} noTopPadding={true}>
            <div>
                {
                    range(config.imageNum).map((i) => (
                        <DynamicImage key={i} src={require(`../../assets/introduction/image-introduction-${config.name}-${i}.png`)}
                            anim={DynamicImageAnim.SlideInFromBottom} lazy />
                    ))
                }
            </div>
        </Page>
    )
};

export const introductionPagePaths = Object.keys(locationConfig);

export default IntroductionPage;
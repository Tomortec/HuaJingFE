
import React from "react";
import _range from "lodash/range";

import { Page } from "../page";
import { DynamicImage, DynamicImageAnim } from "../../components";
import { useDesktop } from "../../hooks/useDesktop";

import "./index.scss";

export const assetsSource = (isDesktop: boolean): string[] => {
    return _range(isDesktop ? 3 : 5).map((i) => (
        require(`../../assets/instructions${isDesktop ? "/desktop" : ""}/image-instructions-${i}.png`)
    ));
};

export const InstructionsPage = () => {
    const noTopPadding = !useDesktop();
    return (
        <Page pageName='instructionsPage' noTopPadding={noTopPadding}>
            <div>
                {
                    assetsSource(useDesktop()).map((src, i) => (
                        <DynamicImage key={i} src={src} 
                            anim={DynamicImageAnim.SlideInFromBottom} />
                    ))
                }
            </div>
        </Page>
    )
};

export default InstructionsPage;
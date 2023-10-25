
import React from "react";
import { range } from "lodash";

import { Page } from "../page";
import { DynamicImage, DynamicImageAnim } from "../../components";
import { useDesktop } from "../../hooks/useDesktop";

import "./index.scss";

export const InstructionsPage = () => {
    const assetsDir = useDesktop() ? "/desktop" : "";
    const assetsNum = useDesktop() ? 3 : 5;
    const noTopPadding = !useDesktop();
    return (
        <Page pageName='instructionsPage' noTopPadding={noTopPadding}>
            <div>
                {
                    range(assetsNum).map((i) => (
                        <DynamicImage key={i} src={require(`../../assets/instructions${assetsDir}/image-instructions-${i}.png`)} 
                            anim={DynamicImageAnim.SlideInFromBottom} lazy />
                    ))
                }
            </div>
        </Page>
    )
};

export default InstructionsPage;
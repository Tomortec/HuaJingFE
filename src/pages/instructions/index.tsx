
import React from "react";
import { range } from "lodash";

import { Page } from "../page";
import { DynamicImage, DynamicImageAnim } from "../../components";

import "./index.scss";

export const InstructionsPage = () => {
    return (
        <Page pageName='instructionsPage' noTopPadding={true}>
            <div>
                {
                    range(5).map((i) => (
                        <DynamicImage key={i} src={require(`../../assets/instructions/image-instructions-${i}.png`)} 
                            anim={DynamicImageAnim.SlideInFromBottom} lazy />
                    ))
                }
            </div>
        </Page>
    )
};

export default InstructionsPage;
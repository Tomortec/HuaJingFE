
import React from "react";

import { Page } from "../page";

import "./index.scss";

const INSTRUCTIONS_IMAGES: string[] = [
    "https://images.pexels.com/photos/17968667/pexels-photo-17968667.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    "https://images.pexels.com/photos/14303230/pexels-photo-14303230.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    "https://images.pexels.com/photos/14619059/pexels-photo-14619059.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    "https://images.pexels.com/photos/18024433/pexels-photo-18024433.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
];

export const InstructionsPage = () => {
    return (
        <Page pageName='instructionsPage' authNeeded={true}>
            <div>
                {
                    INSTRUCTIONS_IMAGES.map((src, i) => 
                        <img src={src} alt="" key={i} />
                    )
                }
            </div>
        </Page>
    )
};
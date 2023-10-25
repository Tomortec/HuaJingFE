
import React from "react";
import { useDesktop } from "../hooks/useDesktop";

/**
 * 
 * @param props desktop Element and mobile Element
 * @returns 
 */
export const MediaWrapper = (props: {
    children: [React.ReactElement, React.ReactElement]
}) => {
    const isDesktop = useDesktop();
    if(isDesktop) {
        return ( props.children[0] );
    } else {
        return ( props.children[1] );
    }
};
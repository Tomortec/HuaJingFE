
import React from "react";

export const SwiperNavigator = (props: {
    title: string,
    buttonsNeeded: boolean,
    onSlideToPrev?: () => void,
    onSlideToNext?: () => void
}) => {
    return (
        <div className="swiper-navigator">
            { props.buttonsNeeded && <div className="prev-btn" onClick={props.onSlideToPrev}></div> }
            <span>{props.title}</span>
            { props.buttonsNeeded && <div className="next-btn" onClick={props.onSlideToNext}></div> }
        </div>
    )
};
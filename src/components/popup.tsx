
import React, { ReactNode } from "react";

export const Popup = (
    props: {
        popupId: string,
        popupTitle: string,
        popupBody: ReactNode | ReactNode[],
        triggerCaption: string | ReactNode,
    }
) => {
    const id = `hj-${props.popupId}-popup`;

    const togglePopup = () => {
        $(`#${id}, #${id} + .popup-mask`).fadeToggle(300);
    };

    return (
        <div className="popup-wrapper">
            <button 
                type="button" className="popup-button btn"
                onClick={togglePopup}
            >{props.triggerCaption}</button>

            <div id={id} className="popup" tabIndex={-1}>
                <div className="popup-content">
                    <div className="popup-header">
                        <span className="popup-title">{props.popupTitle}</span>
                    </div>
                    <div className="popup-body">
                        {props.popupBody}
                    </div>
                </div>
                <div className="popup-close-btn" onClick={togglePopup}></div>
            </div>

            <div className="popup-mask" onClick={togglePopup}></div>
        </div>
    );
};
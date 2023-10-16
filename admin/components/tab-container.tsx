
import React, { memo } from "react";

export interface TabConfig {
    text: string,
    clickHandler: () => void
}

export const TabContainer = (props: {
    children: React.ReactElement,
    tabConfig: TabConfig[]
}) => {
    const TabList = memo(() => {
        return (
            <div className="nav flex-column nav-pills me-4" role="tablist" aria-orientation="vertical">
                {
                    props.tabConfig.map(({ text, clickHandler }, i) => (
                        <button key={i} className="btn btn-primary mb-3" data-bs-toggle="pill" 
                            type="button" role="tab" onClick={clickHandler}
                        >{text}</button>
                    ))
                }
            </div>
        )
    });

    return (
        <div className="tab-container d-flex align-items-start">
            <TabList />
            <div className="tab-content">
                {props.children}
            </div>
        </div>
    )
};

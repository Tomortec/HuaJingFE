
import React, { useEffect, useState, useMemo } from "react";

import { Navbar } from "./components/navbar";
import { TabConfig, TabContainer } from "./components/tab-container";

import { UserTable } from "./components/user-table";
import { PorcelainTable } from "./components/porcelain-table";
import { UserModal } from "./components/user-modal";
import { PorcelainModal } from "./components/porcelain-modal";

import { useAuth } from "./hooks/useAuth";
import { ModalProvider } from "./hooks/useModal";
import { useDevelopmentMode } from "./hooks/useDevelopmentMode";

import "./App.scss";
import { LoginModule } from "./components/login-module";
import { ImageSelectionModal } from "./components/image-selection-modal";
import axios from "axios";

enum Tabs {
    UserData, PorcelainData
}

const TabContent = (props: { tab: Tabs }) => {
    switch(props.tab) {
        case Tabs.UserData:
            return (
                <ModalProvider>
                    <UserTable />
                    <UserModal />
                </ModalProvider>
            )
        case Tabs.PorcelainData:
            return (
                <ModalProvider>
                    <PorcelainTable />
                    <PorcelainModal />
                    <ImageSelectionModal />
                </ModalProvider>
            )
    }
};

export const App = () => {
    const [cntTab, setCntTab] = useState(Tabs.UserData);
    const { auth } = useAuth();

    useEffect(() => {
        if($("#hj-navbar").length) {
            const restHeight = $(window).height() - $("#hj-navbar").outerHeight();
            console.log(restHeight);
            $(".page-container").css({
                position: "absolute",
                top: $("#hj-navbar").outerHeight(),
                height: restHeight
            });
        }
    });

    const tabConfig: TabConfig[] = [
        {
            text: "管理用户",
            clickHandler: () => setCntTab(Tabs.UserData)
        },
        {
            text: "管理藏品",
            clickHandler: () => setCntTab(Tabs.PorcelainData)
        }
    ];

    return (
        <>
            {
                auth ?
                <>
                    <Navbar />
                    <div className="page-container">
                        <TabContainer tabConfig={tabConfig}>
                            <TabContent tab={cntTab} />
                        </TabContainer>
                    </div>
                </> :
                <LoginModule />
            }
        </>
    )
};
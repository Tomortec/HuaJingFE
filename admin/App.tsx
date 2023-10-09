
import React, { useEffect } from "react";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.scss";

import { Navbar } from "./components/navbar";
import { UserTable } from "./components/user-table";
import { PorcelainTable } from "./components/porcelain-table";
import { UserModal } from "./components/user-modal";
import "./App.scss";

export const App = () => {
    useEffect(() => {
        if(!$("#hj-navbar").length) return;

        const restHeight = $(window).height() - $("#hj-navbar").outerHeight();
        console.log(restHeight);
        $(".page-container").css({
            position: "absolute",
            top: $("#hj-navbar").outerHeight(),
            height: restHeight
        });
    });

    return (
        <>
            <Navbar />
            <div className="page-container">
                <Tabs>
                    <TabList>
                        <Tab>管理<br/>用户</Tab>
                        <Tab>管理<br/>收藏</Tab>
                    </TabList>

                    <TabPanel key={"user-table"}>
                        <UserTable />
                    </TabPanel>
                    <TabPanel key={"porcelain-table"}>
                        <PorcelainTable />
                    </TabPanel>
                </Tabs>
            </div>
            <UserModal />
        </>
    )
};

import React from "react";

import "datatables.net-responsive-bs5";
import language from "datatables.net-plugins/i18n/zh.mjs";
import "datatables.net-plugins/sorting/chinese-string";

import { Table } from "./table";
import { UserData } from "../interfaces";
import { showDialog } from "../utilities";

export const UserTable = () => {
    const showModal = (info?: UserData) => {
        showDialog("#user-modal", info);
    };

    const bindButtonsEvents = () => {
        $(document).on("click", ".modify-btn", (event) => {
            try {
                const userInfo = JSON.parse(
                    $(event.target).closest("td[data-row-object]")
                        .attr("data-row-object")
                ) as UserData;
                showModal(userInfo);
            } catch(error) {
                console.error(error);
            }
        });
    };

    const dataTableOptions: DataTables.Settings = {
        ajax: {
            url: "/adminApi/userData",
            dataSrc: "data"
        },
        responsive: true,
        language,
        ordering: true,
        columns: [
            { data: "id", title: "用户 ID" },
            { data: "name", title: "用户名" },
            { data: "phoneNumber", title: "手机号" },
            { data: "level", title: "用户等级" },
            { data: "porcelainIds", title: "持有藏品 ID", defaultContent: "-" },
            { data: "lastLoginTime", title: "上次登录时间", defaultContent: "-" },
            { title: "操作" }
        ],
        columnDefs: [
            {
                targets: 1,
                type: "chinese-string"
            },
            {
                data: null,
                targets: -1,
                defaultContent: `
                    <div class='d-flex justify-content-around'>
                        <button type='button' class='modify-btn btn btn-primary btn-sm'>修改</button>
                        <button type='button' class='delete-btn btn btn-danger btn-sm'>删除</button>
                    </div>
                `,
                createdCell: (td, _, rData) => {
                    $(td).attr({
                        "data-row-object": JSON.stringify(rData)
                    });
                }
            }
        ]
    };

    return (
        <>
            <Table id="hj-user-table" 
                newButtonCaption="新增用户" 
                newButtonHandler={showModal}
                dataTableOptions={dataTableOptions}
                afterRender={bindButtonsEvents} />
        </>
    )
};

import React, { useContext } from "react";

import { Tooltip } from "bootstrap";

import "datatables.net-responsive-bs5";
import "datatables.net-plugins/sorting/chinese-string";

import { Table } from "./table";
import { UserData } from "../interfaces";
import { useModal } from "../hooks/useModal";
import { AuthContext } from "../hooks/authContext";
// import { getPorcelainById } from "../api";
import { deleteUser, getAllUserData } from "../api";
import { UserModalId } from "./user-modal";

export const UserTable = () => {
    const tableId = "hj-user-table";

    const { auth } = useContext(AuthContext);
    const { showModal } = useModal();

    const showDialog = (info?: UserData) => {
        showModal(`#${UserModalId}`, info);
    };

    const showDeletionConfirm = (info?: UserData): boolean => {
        return window.confirm(`
            ${"!".repeat(40)}
            请注意：删除后不可恢复！\n
            确认删除该用户记录？\n
            用户ID：${info.id}
            用户名称：${info.name}
            手机号：${info.phoneNumber}
            等级：${info.level ?? 0}
            藏品个数：${info.porcelainIds.length ?? 0}
            ${"!".repeat(40)}
        `);
    };

    const bindButtonsEvents = () => {
        const getRowData = (
            event: JQuery.ClickEvent | JQuery.MouseOverEvent
        ): UserData => {
            try {
                return JSON.parse(
                    $(event.target).closest("td[data-row-object]")
                        .attr("data-row-object")
                ) as UserData;
            } catch(error) {
                console.error(error);
                return null;
            }
        };

        $(document).on("click", `#${tableId} .modify-btn`, (event) => {
            showDialog(getRowData(event));
        });

        $(document).on("mouseover", `#${tableId} .delete-btn`, (event) => {
            const rowData = getRowData(event);
            Tooltip.getOrCreateInstance($(event.target)[0], {
                title: `用户ID：${rowData.id}
                    用户名称：${rowData.name}
                    手机号：${rowData.phoneNumber}
                    等级：${rowData.level}
                `,
                placement: "bottom"
            }).show();
        });

        $(document).on("mouseleave", `#${tableId} .delete-btn`, (event) => {
            Tooltip.getInstance($(event.target)[0]).hide();
        });

        $(document).on("click", `#${tableId} .delete-btn`, async (event) => {
            if(!auth || !auth.token) {
                alert("未登录！\n请刷新页面");
            } else {
                const rawData = getRowData(event);
                if(rawData && showDeletionConfirm(rawData)) {
                    const res = await deleteUser(auth.token, rawData);
                    alert(res ? "删除用户成功！" : "发生错误");
                }    
            }
        });

        // TODO: get porcelain details when clicking link
        // $(document).on("click", "a.porcelain-link", (event) => {
        //     const porcelainId = $(event.target).attr("data-porcelain-id");
        //     getPorcelainById(porcelainId)
        //         .then((data) => alert(`
        //             藏品 ID：${data.id}
        //             藏品名称：${data.name}
        //             年代：${data.age}
        //             品类：${data.classification}
        //             图片个数：${data.images.length}
        //         `));
        // });
    };

    const porcelainIdsRenderer = (data: string[]) => {
        const comparator = (a: string, b: string) => (
            a.toString().localeCompare(b, undefined, {
                numeric: true,
                sensitivity: "base"
            })
        );
        return `
            <div style="overflow-y: scroll;">
                ${
                    data.sort(comparator).map((value) => (
                        `<a class="porcelain-link text-decoration-none link-primary" 
                            href="#" data-porcelain-id="${value}">${value}</a>`
                    )).join("<span class='user-select-none'>&nbsp;｜&nbsp;</span>")
                }
            </div>
        `
    };

    const dataTableOptions: DataTables.Settings = {
        // ajax: {
        //     url: "/adminApi/userData",
        //     dataSrc: "data"
        // },
        responsive: true,
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
                targets: 4,
                render: (data, type) => {
                    if(type == "display" && (data as string[])) {
                        return porcelainIdsRenderer(data);
                    }
                    return data;
                } 
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
            <Table dataLoader={() => getAllUserData(auth.token)} id={tableId} 
                newButtonCaption="新增用户" 
                newButtonHandler={showDialog}
                dataTableOptions={dataTableOptions}
                afterRender={bindButtonsEvents} />
        </>
    )
};
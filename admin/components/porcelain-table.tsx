
import React, { useContext, useState } from "react";

import { Tooltip } from "bootstrap";

import "datatables.net-plugins/sorting/chinese-string";

import { Table } from "./table";
import { PorcelainData } from "../interfaces";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../hooks/useAuth";
import { useAlert } from "../hooks/useAlert";
import { PorcelainModalId } from "./porcelain-modal";
import { ImageSelectionModalId } from "./image-selection-modal";
import { deletePorcelain, getAllPorcelainData } from "../api";

export const PorcelainTable = () => {
    const tableId = "hj-porcelain-table";
    const [dataTable, setDataTable] = useState<DataTables.Api>(null);

    const { auth } = useAuth();
    const { showModal } = useModal();
    const { showAlert } = useAlert();

    const showDialog = (info?: PorcelainData) => {
        showModal(`#${PorcelainModalId}`, info);
    };

    const showDeletionConfirm = (info?: PorcelainData): boolean => {
        return window.confirm(`
            ${"!".repeat(40)}
            请注意：删除后不可恢复！\n
            确认删除该藏品记录？\n
            藏品ID：${info.id}
            藏品名称：${info.name}
            年代：${info.age}
            品类：${info.classification}
            图片个数：${info.images.length}
            是否是3D模型：${info.model ? "是" : "否"}
            ${"!".repeat(40)}
        `);
    };

    const afterDataTableRendered = (dataTable: DataTables.Api) => {
        setDataTable(dataTable);

        const getRowData = (
            event: JQuery.ClickEvent | JQuery.MouseOverEvent
        ): PorcelainData => {
            try {
                return JSON.parse(
                    $(event.target).closest("td[data-row-object]")
                        .attr("data-row-object")
                ) as PorcelainData;
            } catch(error) {
                console.error(error);
                showAlert(error, true);
                return null;
            }
        };

        // bindButtonsEvents
        $(document).on("click", `#${tableId} .info-modify-btn`, (event) => {
            showDialog(getRowData(event));
        });

        $(document).on("click", `#${tableId} .images-modify-btn`, (event) => {
            const rowData = getRowData(event);
            if(rowData) {
                showModal(`#${ImageSelectionModalId}`, rowData);
            }
        });

        $(document).on("mouseover", `#${tableId} .delete-btn`, (event) => {
            const rowData = getRowData(event);
            Tooltip.getOrCreateInstance($(event.target)[0], {
                title: `藏品ID：${rowData.id}
                    藏品名称：${rowData.name}
                    年代：${rowData.age}
                    品类：${rowData.classification}
                    ${rowData.model ? "3D模型" : "2D藏品"}
                `,
                placement: "bottom"
            }).show();
        });

        $(document).on("mouseleave", `#${tableId} .delete-btn`, (event) => {
            Tooltip.getInstance($(event.target)[0]).hide();
        });

        $(document).on("click", `#${tableId} .delete-btn`, async (event) => {
            if(!auth) {
                showAlert("未登录！\n请刷新页面", true);
            } else {
                const rawData = getRowData(event);
                if(rawData && showDeletionConfirm(rawData)) {
                    const res = await deletePorcelain(auth, rawData);
                    showAlert(res ? `删除藏品"${rawData.name}"成功！` : "发生错误", !res);
                    res && dataTable.row((_, data) => data.id == rawData.id).remove().draw();
                }
            }
        });
    };

    const dataTableOptions: DataTables.Settings = {
        scrollX: true,
        columns: [
            { data: "id", title: "藏品 ID" },
            { data: "name", title: "藏品名称" },
            { data: "age", title: "年代" },
            { data: "classification", title: "品类" },
            { data: "bottomStamp", title: "底款" },
            { data: "sizeIntroduction", title: "规格" },
            { data: "description", title: "介绍" },
            { data: "descriptionText", title: "介绍文字" },
            { data: "images", title: "藏品图" },
            { data: "model", title: "模型" },
            { data: "exposure", title: "模型曝光度" },
            { title: "操作" }
        ],
        columnDefs: [
            {
                // ID, name, age
                targets: [0, 1, 2],
                className: "medium-column"
            },
            {
                // classification, bottomStamp
                targets: [3, 4],
                className: "small-column"
            },
            {
                // sizeIntroduction, model, exposure
                targets: [5, 9, 10],
                className: "large-column"
            },
            {
                // description
                targets: [6, 7],
                className: "xlarge-column"
            },
            {
                targets: [1, 2, 3, 4, 5],
                type: "chinese-string"
            },
            {
                // description
                targets: [6],
                render: (data, type) => {
                    if(type == "display") {
                        const link = data as string;
                        if(!link) return "-";

                        return `<a href=${link} target='_blank'>${link}</a>`
                    }
                    return data;
                }
            },
            {
                // descriptionText
                targets: 7,
                defaultContent: "-"
            },
            {
                // images
                targets: 8,
                render: (data, type) => {
                    if(type == "display") {
                        const links = data as string[];
                        if(!links || !links.length) return "-";
                        
                        return links.map((link) => 
                            `<a href=${link} target='_blank'>${link}</a><br>`
                        ).join("");
                    }
                    return data;
                } 
            },
            {
                // model
                targets: 9,
                render: (data, type) => {
                    if(type == "display") {
                        const link = data as string;
                        if(!link) return "-";
                        return `<a href="https://tomortec.github.io/SimpleOnlineModelRenderer/?src=${encodeURIComponent(link)}" target="_blank">${link}</a>`
                    }
                    return data;
                }
            },
            {
                data: null,
                targets: -1,
                defaultContent: `
                    <div class='d-flex flex-column justify-content-around flex-wrap text-nowrap'>
                        <button type='button' class='info-modify-btn btn btn-primary btn-sm mb-3'>修改</button>
                        <button type='button' class='images-modify-btn btn btn-primary btn-sm mb-3'>更改藏品图</button>
                        <button type='button' class='delete-btn btn btn-danger btn-sm mb-3' >删除</button>
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
            <Table dataLoader={() => getAllPorcelainData(auth)} id={tableId}
                newButtonCaption="新增藏品"
                newButtonHandler={showDialog}
                dataTableOptions={dataTableOptions}
                afterRender={afterDataTableRendered} />
        </>
    )
};

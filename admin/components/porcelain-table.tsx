
import React from "react";

import { Tooltip } from "bootstrap";

import "datatables.net-plugins/sorting/chinese-string";

import { Table } from "./table";
import { PorcelainData } from "../interfaces";
import { useModal } from "../hooks/useModal";
import { PorcelainModalId } from "./porcelain-modal";
import { ImageSelectionModalId, ImageSelectionModalPayload } from "./image-selection-modal";

export const PorcelainTable = () => {
    const tableId = "hj-porcelain-table";

    const { showModal } = useModal();

    const showDialog = (info?: PorcelainData) => {
        showModal(`#${PorcelainModalId}`, info);
    };

    const showDeletionConfirm = (info?: PorcelainData) => {
        window.confirm(`
            ${"!".repeat(40)}
            请注意：删除后不可恢复！\n
            确认删除该藏品记录？\n
            藏品ID：${info.id}
            藏品名称：${info.name}
            年代：${info.age}
            品类：${info.classification}
            图片个数：${info.images.length}
            ${"!".repeat(40)}
        `);
    };

    const bindButtonsEvents = () => {
        const getRowData = (
            event: JQuery.ClickEvent | JQuery.MouseOverEvent
        ) => {
            try {
                return JSON.parse(
                    $(event.target).closest("td[data-row-object]")
                        .attr("data-row-object")
                ) as PorcelainData;
            } catch(error) {
                console.error(error);
                return null;
            }
        };

        $(document).on("click", `#${tableId} .info-modify-btn`, (event) => {
            showDialog(getRowData(event));
        });

        $(document).on("click", `#${tableId} .images-modify-btn`, (event) => {
            const rowData = getRowData(event);
            if(rowData && rowData.id && rowData.images) {
                showModal(`#${ImageSelectionModalId}`, 
                    { porcelainId: rowData.id, images: rowData.images } as ImageSelectionModalPayload);
            }
        });

        $(document).on("mouseover", `#${tableId} .delete-btn`, (event) => {
            const rowData = getRowData(event);
            Tooltip.getOrCreateInstance($(event.target)[0], {
                title: `藏品ID：${rowData.id}
                    藏品名称：${rowData.name}
                    年代：${rowData.age}
                    品类：${rowData.classification}
                `,
                placement: "bottom"
            }).show();
        });

        $(document).on("mouseleave", `#${tableId} .delete-btn`, (event) => {
            Tooltip.getInstance($(event.target)[0]).hide();
        });

        $(document).on("click", `#${tableId} .delete-btn`, (event) => {
            showDeletionConfirm(getRowData(event));
        });
    };

    const dataTableOptions: DataTables.Settings = {
        ajax: {
            url: "/adminApi/porcelainData",
            dataSrc: "data"
        },
        scrollX: true,
        columns: [
            { data: "id", title: "藏品 ID" },
            { data: "name", title: "藏品名称" },
            { data: "age", title: "年代" },
            { data: "classification", title: "品类" },
            { data: "bottomStamp", title: "底款" },
            { data: "sizeIntroduction", title: "规格" },
            { data: "description", title: "介绍" },
            { data: "images", title: "藏品图" },
            { title: "操作" }
        ],
        columnDefs: [
            {
                targets: [0, 1, 2],
                className: "medium-column"
            },
            {
                targets: [3, 4],
                className: "small-column"
            },
            {
                targets: [5],
                className: "large-column"
            },
            {
                targets: [6],
                className: "xlarge-column"
            },
            {
                targets: [1, 2, 3, 4, 5, 6],
                type: "chinese-string"
            },
            {
                targets: -2,
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
            <Table id={tableId}
                newButtonCaption="新增藏品"
                newButtonHandler={showDialog}
                dataTableOptions={dataTableOptions}
                afterRender={bindButtonsEvents} />
        </>
    )
};

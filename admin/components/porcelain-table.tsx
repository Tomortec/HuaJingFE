
import React from "react";

import bootstrap from "bootstrap";

import language from "datatables.net-plugins/i18n/zh.mjs";
import "datatables.net-plugins/sorting/chinese-string";

import { Table } from "./table";

export const PorcelainTable = () => {
    const dataTableOptions: DataTables.Settings = {
        ajax: {
            url: "/adminApi/porcelainData",
            dataSrc: "data"
        },
        language,
        scrollX: true,
        ordering: true,
        columns: [
            { data: "id", title: "藏品 ID" },
            { data: "name", title: "藏品名称" },
            { data: "age", title: "年代" },
            { data: "classification", title: "品类" },
            { data: "bottomStamp", title: "底款" },
            { data: "sizeIntroduction", title: "尺寸" },
            { data: "description", title: "介绍" },
            { 
                data: "images", title: "藏品图",
                render: (data, type) => {
                    if(type == "display") {
                        return data.map((link) => 
                            `<a href=${link} target='_blank'>${link}</a><br>`
                        ).join("");
                    }
                    return data;
                } 
            },
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
                data: null,
                targets: -1,
                defaultContent: `
                    <div class='d-flex flex-column justify-content-around flex-wrap text-nowrap'>
                        <button type='button' class='modify-btn btn btn-primary btn-sm mb-3'>修改</button>
                        <button type='button' class='modify-btn btn btn-primary btn-sm mb-3'>更改藏品图</button>
                        <button type='button' class='delete-btn btn btn-danger btn-sm mb-3'>删除</button>
                    </div>
                `
            }
        ]
    };

    return (
        <>
            <Table id="hj-porcelain-table" 
                newButtonCaption="新增藏品"
                newButtonHandler={() => {}}
                dataTableOptions={dataTableOptions} />
        </>
    )
};

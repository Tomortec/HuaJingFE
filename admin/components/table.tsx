
import React, { useEffect } from "react";

export const Table = (
    props: {
        id: string,
        newButtonCaption: string,
        newButtonHandler: Function,
        dataTableOptions: DataTables.Settings,
        afterRender?: Function
    }
) => {
    useEffect(() => {
        $(`#${props.id}`).DataTable(props.dataTableOptions);

        $(`#${props.id}_wrapper label`)
            .addClass("input-group mb-3 align-items-center")
            .last().css({ justifyContent: "flex-end" });

        $(
            `<div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary mb-3">
                    ${props.newButtonCaption}
                </button>
            </div>`
        )
            .on("click", () => { props.newButtonHandler(); })
            .insertBefore(".dt-row");

        props.afterRender && props.afterRender();
    });

    return (
        <div>
            <table id={`${props.id}`} className="table table-bordered table-hover">
            </table>
        </div>
    )
};
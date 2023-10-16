
import React, { Component } from "react";

import "datatables.net-bs5";
import language from "datatables.net-plugins/i18n/zh.mjs";
import "jquery-highlight";

declare global {
    interface JQuery {
        highlight(words: string[] | string): JQuery.Node;
        unhighlight(): JQuery.Node;
    }
}

interface TableProps {
    id: string,
    newButtonCaption: string,
    newButtonHandler: Function,
    dataTableOptions: DataTables.Settings,
    afterRender?: Function
}

export class Table extends Component<TableProps> {

    shouldComponentUpdate = () => false

    componentDidMount() {
        const dataTable =  $(`#${this.props.id}`).DataTable(Object.assign({
            language,
            ordering: true
        }, this.props.dataTableOptions));
        
        dataTable.on("draw", () => {
            const body = $(dataTable.table(`#${this.props.id}`).body());

            body.unhighlight();
            if(dataTable.rows({ filter: "applied" }).data().length) {
                body.highlight(dataTable.search());
            }
        });

        $(`#${this.props.id}_wrapper label`)
            .addClass("input-group mb-3 align-items-center")
            .last().css({ justifyContent: "flex-end" });

        $(
            `<div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary mb-3">
                    ${this.props.newButtonCaption}
                </button>
            </div>`
        )
            .on("click", "button", () => { this.props.newButtonHandler(); })
            .insertBefore(".dt-row");

        this.props.afterRender && this.props.afterRender();
    }

    render() {
        return (
            <div>
                <table id={`${this.props.id}`} className="table table-bordered table-hover">
                </table>
            </div>
        )
    }
}

// const _Table = (
//     props: {
//         id: string,
//         newButtonCaption: string,
//         newButtonHandler: Function,
//         dataTableOptions: DataTables.Settings,
//         afterRender?: Function
//     }
// ) => {
//     // stop reinitialising DataTable
//     // https://datatables.net/manual/tech-notes/3
//     if($.fn.dataTable.isDataTable(`#${props.id}`)) {
//         return <></>
//     }

//     useEffect(() => {
//         $(`#${props.id}`).DataTable(props.dataTableOptions);

//         $(`#${props.id}_wrapper label`)
//             .addClass("input-group mb-3 align-items-center")
//             .last().css({ justifyContent: "flex-end" });

//         $(
//             `<div class="d-flex justify-content-end">
//                 <button type="button" class="btn btn-primary mb-3">
//                     ${props.newButtonCaption}
//                 </button>
//             </div>`
//         )
//             .on("click", () => { props.newButtonHandler(); })
//             .insertBefore(".dt-row");

//         props.afterRender && props.afterRender();
//     });

//     return (
//         <div>
//             <table id={`${props.id}`} className="table table-bordered table-hover">
//             </table>
//         </div>
//     )
// };

// export const Table = memo(_Table);
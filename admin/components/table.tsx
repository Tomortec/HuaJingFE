
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
    dataLoader: () => Promise<any[]>,
    id: string,
    newButtonCaption: string,
    newButtonHandler: Function,
    dataTableOptions: DataTables.Settings,
    afterRender?: (dataTable: DataTables.Api) => void
}

export class Table extends Component<TableProps> {

    dataTable: DataTables.Api;

    shouldComponentUpdate = () => false

    componentDidMount() {
        this.props.dataLoader().then((data) => {
            this.dataTable =  $(`#${this.props.id}`).DataTable(Object.assign({
                data: data,
                language,
                ordering: true
            }, this.props.dataTableOptions));

            globalThis.dataTables = globalThis.dataTables || {};
            globalThis.dataTables[this.props.id] = this.dataTable;
            
            this.dataTable.on("draw", () => {
                const body = $(this.dataTable.table(`#${this.props.id}`).body());
    
                body.unhighlight();
                if(this.dataTable.rows({ filter: "applied" }).data().length) {
                    body.highlight(this.dataTable.search());
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
    
            this.props.afterRender && this.props.afterRender(this.dataTable);    
        });
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
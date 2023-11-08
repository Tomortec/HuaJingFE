
import { Toast } from "bootstrap";
import _uniqueId from "lodash/uniqueId";

export const useAlert = () => {

    const showAlert = (message: string, isDanger: boolean = false) => {
        const alertId = _uniqueId("alert-");
        $(
            `
            <div role="alert" aria-live="assertive" aria-atomic="true" 
                class="toast ${ isDanger ? "top-50 start-50" : "bottom-0 end-0 mb-3 me-3" } position-absolute text-light ${isDanger ? "bg-danger" : "bg-primary"}"
            >
                <div class="toast-header">
                    <strong class="me-auto">${isDanger ? "⚠️警告" : "通知"}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
            `
        )
            .attr("id", alertId)
            .appendTo(document.body);

        Toast.getOrCreateInstance(`#${alertId}`, {
            autohide: !isDanger,
            delay: 3000
        }).show();
    };

    return {
        showAlert
    }
};
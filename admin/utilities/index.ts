
export const showDialog = (id: string, payload: any) => {
    $(id)
        .css("display", "block")
        .addClass("show");
};

export const hideDialog = (id: string) => {
    $(id)
        .removeClass("show")
        .css("display", "none");
};
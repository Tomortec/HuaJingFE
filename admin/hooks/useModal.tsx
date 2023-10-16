
import React from "react";
import { useState, createContext, useContext, useMemo, ReactElement } from "react";

interface ModalContextType {
    payload: any;
    showModal: (id: string, payload: any) => void;
    hideModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextType>({
    payload: null,
    showModal(id, payload) { },
    hideModal(id) { },
});

export const ModalProvider = (props: {
    children: ReactElement | ReactElement[]
}) => {
    const [payload, setPayload] = useState(null);

    const showModal = (id: string, payload: any = null) => {
        setPayload(payload);
        $(id)
            .css("display", "block")
            .addClass("show");
        $("body").css("overflow", "hidden");
    };

    const hideModal = (id: string) => {
        $(id)
            .removeClass("show")
            .css("display", "none");
        $("body").css("overflow", "auto");
    };

    const value = useMemo(() => ({
        payload,
        showModal,
        hideModal
    }), [payload]);

    return (
        <ModalContext.Provider value={value}>
            {props.children}
        </ModalContext.Provider>
    )
};

export const useModal = () => {
    return useContext(ModalContext);
};
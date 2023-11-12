
import React, { useEffect, useState, Reducer, useReducer } from "react";

import _toNumber from "lodash/toNumber";
import { UserData, defaultUserData } from "../interfaces";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../hooks/useAuth";
import { useAlert } from "../hooks/useAlert";
import { createUser, updateUser } from "../api";

export const UserModalId = "user-modal";

const phoneNumberRegex = "^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$";

enum ModalMode {
    Creating,
    Updating
}

export const UserModal = () => {
    const modalId = UserModalId;
    const tableId = "hj-user-table";
    const { auth } = useAuth();
    const { showAlert } = useAlert();

    const { payload, hideModal }: {
        payload?: UserData,
        hideModal: (id: string) => void
    } = useModal();

    const [mode, setMode] = useState(ModalMode.Creating);
    const [state, setState] = useReducer<Reducer<UserData, Partial<UserData>>>(
        (state, newState) => ({...state, ...newState}),
        defaultUserData
    );
    const [isRequesting, setIsRequesting] = useState(false);

    const hideDialog = () => !isRequesting && hideModal(`#${modalId}`);

    useEffect(() => {
        if(payload) {
            setMode(ModalMode.Updating);
            setState(payload);
        } else {
            setMode(ModalMode.Creating);
            setState(defaultUserData);
        }
    }, [payload]);

    const updateTableData = (newData: UserData) => {
        if(!globalThis.dataTables || !globalThis.dataTables[tableId]) return;
        const dataTable: DataTables.Api = globalThis.dataTables[tableId];
        let trueData = newData;
        switch(mode) {
            case ModalMode.Creating:
                const lastId = (dataTable.row(":last").data() as UserData)?.id;
                if(lastId) {
                    trueData = { ...newData, id: (_toNumber(lastId) + 1).toString() };
                    dataTable.row.add(trueData).draw();
                }
                break;
            case ModalMode.Updating:
                dataTable.row((_, data) => data.id == trueData.id).data(trueData).draw();
                break;
        }
        $(dataTable.row((_, data) => data.id == trueData.id).node())
            .children("td").last().attr("data-row-object", JSON.stringify(trueData));
    };

    const handleSaveBtnClicked = async () => {
        if(!auth) {
            showAlert("未登录！\n请刷新页面", true);
        } else {
            setIsRequesting(true);
            if(mode == ModalMode.Updating) {
                const res = await updateUser(auth, state);
                showAlert(res ? `更新用户"${state.id}"成功！` : "发生错误", !res);
                res && updateTableData(state);
            } else {
                const res = await createUser(auth, state);
                showAlert(res ? `创建用户"${state.id}"成功！` : "发生错误", !res);
                res && updateTableData(state);
            }
            setIsRequesting(false);
        }
        hideDialog();
    };

    return (
        <div id={modalId} className="modal fade">
            <div className="modal-bg" onClick={hideDialog}></div>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{ payload ? "修改用户数据" : "新增用户" }</h5>
                        {
                            mode == ModalMode.Creating &&
                            <button type="button" className="btn btn-reset" onClick={() => setState(defaultUserData)}>
                                <i className="bi bi-arrow-counterclockwise"></i>
                            </button>
                        }
                    </div>
                    <div className="modal-body">
                        {
                            payload ?
                            <div className="mb-3">
                                <span className="mb-3">{`用户 ID: ${payload.id}`}</span><br />
                                <span>{`手机号: ${payload.phoneNumber}`}</span>
                            </div> :
                            <div className="mb-3">
                                <label htmlFor="phoneNumberInput" className="form-label">手机号</label>
                                <input type="text" className="form-control" value={state.phoneNumber}
                                    id="phoneNumberInput" onChange={(e) => setState({ phoneNumber: e.currentTarget.value })} />
                            </div>
                        }
                        <div className="mb-3">
                            <label htmlFor="nameInput" className="form-label">用户名</label>
                            <input type="text" className="form-control" value={state.name}
                                id="nameInput" placeholder="10个字符以内（5个汉字）" 
                                maxLength={10}
                                onChange={(e) => setState({ name: e.currentTarget.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="levelInput">用户等级</label>
                            <input type="number" className="form-control" value={state.level}
                                id="levelInput" min={0} max={5} 
                                placeholder="在 0-5 之间"
                                onChange={(e) => setState({ level: Number(e.currentTarget.value) })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="porcelainInput">持有藏品 ID</label>
                            <textarea className="form-control" id="porcelainInput" value={state.porcelainIds}
                                rows={5} placeholder="最多可输入1000个，用英文逗号隔开"
                                onChange={(e) => setState({ porcelainIds: e.currentTarget.value.split(",") })}
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" disabled={isRequesting} onClick={handleSaveBtnClicked}>保存</button>
                        <button type="button" className="btn" onClick={hideDialog}>关闭</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
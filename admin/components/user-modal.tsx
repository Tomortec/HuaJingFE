
import React, { useContext, useEffect, useState, Reducer, useReducer } from "react";

import { UserData, defaultUserData } from "../interfaces";
import { useModal } from "../hooks/useModal";
import { AuthContext } from "../hooks/authContext";
import { createUser, updateUser } from "../api";
import { Modal } from "bootstrap";

export const UserModalId = "user-modal";

const phoneNumberRegex = "^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$";

enum ModalMode {
    Creating,
    Updating
}

export const UserModal = () => {
    const modalId = UserModalId;
    const { auth } = useContext(AuthContext);
    const { payload, hideModal }: {
        payload?: UserData,
        hideModal: (id: string) => void
    } = useModal();
    const hideDialog = () => { hideModal(`#${modalId}`) };

    const [mode, setMode] = useState(ModalMode.Creating);
    const [state, setState] = useReducer<Reducer<UserData, Partial<UserData>>>(
        (state, newState) => ({...state, ...newState}),
        defaultUserData
    );

    useEffect(() => {
        if(payload) {
            setMode(ModalMode.Updating);
            setState(payload);
        } else {
            setMode(ModalMode.Creating);
            setState(defaultUserData);
        }
    }, [payload]);

    const handleSaveBtnClicked = async () => {
        if(!auth || !auth.token) {
            alert("未登录！\n请刷新页面");
        } else {
            if(mode == ModalMode.Updating) {
                const res = await updateUser(auth.token, state);
                alert(res ? "更新用户成功！" : "发生错误");
            } else {
                const res = await createUser(auth.token, state);
                alert(res ? "创建用户成功！" : "发生错误");
            }
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
                        <button type="button" className="btn btn-primary" onClick={handleSaveBtnClicked}>保存</button>
                        <button type="button" className="btn" onClick={hideDialog}>关闭</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

import React from "react";

import { UserData } from "../interfaces";
import { useModal } from "../hooks/useModal";

export const UserModalId = "user-modal";

const phoneNumberRegex = "^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$";

export const UserModal = () => {
    const modalId = UserModalId;

    const { payload, hideModal }: {
        payload?: UserData,
        hideModal: (id: string) => void
    } = useModal();

    const hideDialog = () => { hideModal(`#${modalId}`) };

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
                                <input type="text" className="form-control" 
                                    id="phoneNumberInput" pattern={phoneNumberRegex} />
                            </div>
                        }
                        <div className="mb-3">
                            <label htmlFor="nameInput" className="form-label">用户名</label>
                            <input type="text" className="form-control" 
                                id="nameInput" placeholder="10个字符以内（5个汉字）" 
                                maxLength={10} defaultValue={payload ? payload.name : ""} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="levelInput">用户等级</label>
                            <input type="number" className="form-control" 
                                id="levelInput" min={0} max={5} 
                                placeholder="在 0-5 之间" defaultValue={payload ? payload.level : 0} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="porcelainInput">持有藏品 ID</label>
                            <textarea className="form-control" id="porcelainInput" 
                                rows={5} placeholder="最多可输入1000个，用英文逗号隔开"
                                defaultValue={payload && payload.porcelainIds ? payload.porcelainIds.join() : ""}></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary">保存</button>
                        <button type="button" className="btn" onClick={hideDialog}>关闭</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
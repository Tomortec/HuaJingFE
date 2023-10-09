
import React from "react";

import { UserData } from "../interfaces";
import { hideDialog } from "../utilities";

export const UserModal = (
    props: { info?: UserData }
) => {
    const hideModal = () => { hideDialog("#user-modal") };

    return (
        <div id="user-modal" className="modal fade">
            <div className="modal-bg" onClick={hideModal}></div>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{ props.info ? "修改用户数据" : "新增用户" }</h5>
                    </div>
                    <div className="modal-body">
                        {
                            props.info ?
                            <div>
                                <span>{`用户 ID: ${props.info.id}`}</span>
                                <span>{`手机号: ${props.info.phoneNumber}`}</span>
                            </div> :
                            <div className="mb-3">
                                <label htmlFor="phoneNumberInput" className="form-label">手机号</label>
                                <input type="number" className="form-control" id="phoneNumberInput" />
                            </div>
                        }
                        <div className="mb-3">
                            <label htmlFor="nameInput" className="form-label">用户名</label>
                            <input type="text" className="form-control" id="nameInput" placeholder="10个字符以内（5个汉字）" maxLength={10} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="levelInput">用户等级</label>
                            <input type="number" className="form-control" id="levelInput" min={0} max={5} placeholder="在 0-5 之间" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="porcelainInput">持有藏品 ID</label>
                            <textarea className="form-control" id="porcelainInput" rows={5} placeholder="最多可输入1000个，用英文逗号隔开"></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary">保存</button>
                        <button type="button" className="btn" onClick={hideModal}>关闭</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
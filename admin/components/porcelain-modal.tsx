
import React from "react";

import { PorcelainData } from "../interfaces";
import { useModal } from "../hooks/useModal";

export const PorcelainModalId = "porcelain-modal"

export const PorcelainModal = () => {
    const modalId = PorcelainModalId;

    const { payload, hideModal }: {
        payload?: PorcelainData,
        hideModal: (id: string) => void
    } = useModal();

    const hideDialog = () => { hideModal(`#${modalId}`) };

    return (
        <div id={modalId} className="modal fade">
            <div className="modal-bg" onClick={hideDialog}></div>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{ payload ? "修改藏品" : "新增藏品" }</h5>
                    </div>
                    <div className="modal-body">
                        {
                            payload &&
                            <div className="mb-3">
                                <span className="mb-3">{`藏品 ID: ${payload.id}`}</span><br />
                            </div>
                        }
                        <div className="mb-3">
                            <label htmlFor="nameInput" className="form-label">藏品名称</label>
                            <input type="text" className="form-control" 
                                id="nameInput" placeholder="40个字符以内（20个汉字）" 
                                maxLength={40} defaultValue={payload ? payload.name : ""} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ageInput">年代</label>
                            <input type="text" className="form-control" 
                                id="ageInput" placeholder="40个字符以内（20个汉字）" 
                                defaultValue={payload ? payload.age : ""} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="classificationInput">品类</label>
                            <input type="text" className="form-control" 
                                id="classificationInput" placeholder="40个字符以内（20个汉字）" 
                                defaultValue={payload && payload.classification ? payload.classification : ""} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="stampInput">底款</label>
                            <input type="text" className="form-control" 
                                id="stampInput" placeholder="40个字符以内（20个汉字）" 
                                defaultValue={payload && payload.bottomStamp ? payload.bottomStamp : ""} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sizeInput">规格说明</label>
                            <input type="text" className="form-control"
                                id="sizeInput" placeholder="40个字符以内（20个汉字）"
                                defaultValue={payload && payload.sizeIntroduction ? payload.sizeIntroduction : ""} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descriptionInput">介绍</label>
                            <textarea className="form-control" id="descriptionInput" 
                                rows={5} placeholder="最多可输入3000个汉字"
                                defaultValue={payload && payload.description ? payload.description : ""}></textarea>
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
}
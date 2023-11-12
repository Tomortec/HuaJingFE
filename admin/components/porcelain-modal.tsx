
import React, { Reducer, useEffect, useReducer, useState } from "react";

import _toNumber from "lodash/toNumber";
import { PorcelainData, defaultPorcelainData } from "../interfaces";
import { useModal } from "../hooks/useModal";
import { ImageUploader } from "./image-uploader";

import { createPorcelain, updatePorcelain, uploadPorcelainImage } from "../api";
import { useAuth } from "../hooks/useAuth";
import { useAlert } from "../hooks/useAlert";

export const PorcelainModalId = "porcelain-modal";

enum ModalMode {
    Creating,
    Updating
}

/**
 * Porcelain Image Uploading Process:  
 * 1. user upload image via `ImageUploader`(using `useDropzone`)  
 * 2. `ImageUploader` calls handler to pass image's url and `File`  
 * 3. store the image's url in `state` object to **preview the image** and
 * store `File` in `newDescription` state to **upload to server**
 * 4. on saving, upload `File` to server via `uploadPorcelainImage` with a *true* `replaceImages`
 * param which can replace the porcelain object's `images` property to the newly uploaded image's url
 * 5. now, you got a *newPorcelain* with right `images`
 * @returns 
 */
export const PorcelainModal = () => {
    const modalId = PorcelainModalId;
    const tableId = "hj-porcelain-table";

    const { auth } = useAuth();
    const { showAlert } = useAlert();

    const { payload, hideModal }: {
        payload?: PorcelainData,
        hideModal: (id: string) => void
    } = useModal();
    
    const [mode, setMode] = useState(ModalMode.Creating);
    const [newDescriptionImage, setNewDescriptionImage] = useState<File>(null);
    const [state, setState] = useReducer<Reducer<PorcelainData, Partial<PorcelainData>>>(
        (state, newState) => ({...state, ...newState}),
        defaultPorcelainData
    );
    const [isRequesting, setIsRequesting] = useState(false);

    const hideDialog = () => !isRequesting && hideModal(`#${modalId}`);

    useEffect(() => {
        if(payload) {
            setMode(ModalMode.Updating);
            setState(payload);
        } else {
            setMode(ModalMode.Creating);
            setState(defaultPorcelainData);
        }
        setNewDescriptionImage(null);
    }, [payload]);

    const updateTableData = (newData: PorcelainData) => {
        if(!globalThis.dataTables || !globalThis.dataTables[tableId]) return;
        const dataTable: DataTables.Api = globalThis.dataTables[tableId];
        let trueData = newData;
        switch(mode) {
            case ModalMode.Creating:
                const lastId = (dataTable.row(":last").data() as PorcelainData)?.id;
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
    }

    const handleSaveBtnClicked = async () => {
        if(!auth) {
            showAlert("未登录！\n请刷新页面", true);
        } else {
            setIsRequesting(true);
            if(mode == ModalMode.Updating) {
                let res = false;
                let newPorcelain = state;
                if(newDescriptionImage) {
                    newPorcelain = await uploadPorcelainImage(auth, state, [newDescriptionImage], { isDescription: true });
                }
                res = await updatePorcelain(auth, newPorcelain);
                res && updateTableData(newPorcelain);
                showAlert(res ? `更新藏品"${newPorcelain.name}"成功！` : "发生错误", !res);
            } else {
                if(newDescriptionImage) {
                    const newPorcelain = await uploadPorcelainImage(auth, state, [newDescriptionImage], { isDescription: true  });
                    console.log(newPorcelain);
                    const res = await createPorcelain(auth, newPorcelain);
                    showAlert(res ? `创建藏品"${newPorcelain.name}"成功！` : "发生错误", !res);
                    res && updateTableData(newPorcelain);
                } else {
                    showAlert("没有上传介绍图片", true);
                }
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
                                maxLength={40} value={state.name}
                                onChange={(e) => setState({ name: e.currentTarget.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ageInput">年代</label>
                            <input type="text" className="form-control" 
                                id="ageInput" placeholder="40个字符以内（20个汉字）" 
                                value={state.age} onChange={(e) => setState({ age: e.currentTarget.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="classificationInput">品类</label>
                            <input type="text" className="form-control" 
                                id="classificationInput" placeholder="40个字符以内（20个汉字）" 
                                value={state.classification} onChange={(e) => setState({ classification: e.currentTarget.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="stampInput">底款</label>
                            <input type="text" className="form-control" 
                                id="stampInput" placeholder="40个字符以内（20个汉字）" 
                                value={state.bottomStamp} onChange={(e) => setState({ bottomStamp: e.currentTarget.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sizeInput">规格说明</label>
                            <input type="text" className="form-control"
                                id="sizeInput" placeholder="40个字符以内（20个汉字）"
                                value={state.sizeIntroduction} onChange={(e) => setState({ sizeIntroduction: e.currentTarget.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descriptionTextInput">介绍文字</label>
                            <input type="text" className="form-control"
                                id="descriptionTextInput" placeholder="40个字符以内（20个汉字）"
                                value={state.descriptionText} onChange={(e) => setState({ descriptionText: e.currentTarget.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descriptionInput">介绍</label><br />
                            { state.description && <img style={{ width: "100%" }} src={state.description} alt="" /> }
                            <ImageUploader maxFiles={1} filesDroppedHandler={(urls, files) => {
                                setState({ description: urls[0] });
                                setNewDescriptionImage(files[0]);
                            }} />
                            { state.images.length > 0 && <i>* 上传新图片后将会覆盖原图片</i> }
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
}
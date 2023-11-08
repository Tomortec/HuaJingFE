
import React, { useEffect, useState } from "react";
import _clamp from "lodash/clamp";

import { ImageUploader } from "./image-uploader";
import { useModal } from "../hooks/useModal";
import { updatePorcelain, updatePorcelainImage, uploadPorcelainImage, uploadPorcelainModel } from "../api";
import { PorcelainData } from "../interfaces";
import { useAuth } from "../hooks/useAuth";
import { useAlert } from "../hooks/useAlert";

export const ImageSelectionModalId = "image-selection-modal";

const ImageSelector = (props: {
    src: string,
    index: number,
    isChecked: boolean,
    removalHandler: (index: number) => void,
    selectionHandler: (index: number) => void
}) => {
    const radioId = `image-selector-radio-${props.index}`;

    return (
        <div className="image-selector">
            <a href={props.src} target="_blank">
                <img src={props.src} alt="" />
            </a>
            <div className="remove-btn" onClick={() => props.removalHandler(props.index)}>
                <i className="bi-x-circle-fill"></i>
            </div>
            <div className="form-check">
                <input type="radio" className="form-check-input" 
                    id={radioId} checked={props.isChecked} 
                    onChange={() => props.selectionHandler(props.index)} />
                <label className="form-check-label" htmlFor={radioId}>封面图</label>
            </div>
        </div>
    )
};

export const ImageSelectionModal = () => {
    const modalId = ImageSelectionModalId;
    const tableId = "hj-porcelain-table";
    const { auth } = useAuth();
    const { showAlert } = useAlert();

    const { payload, hideModal }: {
        payload: PorcelainData,
        hideModal: (id: string) => void
    } = useModal();

    const [images, setImages] = useState<string[]>(null);
    const [newImages, setNewImages] = useState<File[]>(null);
    const [coverIndex, setCoverIndex] = useState(0);
    const [model, setModel] = useState<string>(null);
    const [modelFile, setModelFile] = useState<File>(null);
    const [exposure, setExposure] = useState(1);
    const [isRequesting, setIsRequesting] = useState(false);

    const hideDialog = () => !isRequesting && hideModal(`#${modalId}`);

    useEffect(() => {
        if(payload) {
            setCoverIndex(0);
            setImages(payload.images);
            setNewImages(null);
            setModel(payload.model);
            setModelFile(null);
            setExposure(payload.exposure ?? 1.0);
        } else {
            setCoverIndex(0);
            setImages(null);
            setNewImages(null);
            setModel(null);
            setModelFile(null);
            setExposure(1.0);
        }
    }, [payload]);

    const removeImage = (i: number) => {
        setCoverIndex(_clamp(coverIndex, 0, images.length - 2));
        setImages(
            images.slice(0, i).concat(images.slice(i + 1, images.length))
        );
    };

    const updateTableData = (newData: PorcelainData) => {
        if(!globalThis.dataTables || !globalThis.dataTables[tableId]) return;
        const dataTable = globalThis.dataTables[tableId];
        dataTable.row((_, data) => data.id == newData.id).data(newData).draw();
        $(dataTable.row((_, data) => data.id == newData.id).node())
            .children("td").last().attr("data-row-object", JSON.stringify(newData));
    }

    const onImageSelected = (i: number) => { setCoverIndex(i); };
    const onImagesDropped = (urls: string[], files: File[]) => { setImages(images.concat(urls)); setNewImages(files); };
    const onConfirm = async () => {
        if(!auth) {
            showAlert("未登录！\n请刷新页面", true);
        } else {
            setIsRequesting(true);
            let newPorcelain = payload;
            // delete image
            newPorcelain.images = images;
            // add or replace model
            if(model && model != payload.model && modelFile) {
                newPorcelain = await uploadPorcelainModel(auth, newPorcelain, modelFile);
            }
            // add images
            if((newImages && newImages.length > 0)) {
                newPorcelain = await uploadPorcelainImage(auth, newPorcelain, newImages);
            }
            // change cover image
            if(coverIndex != 0) {
                newPorcelain.images.unshift(newPorcelain.images.splice(coverIndex, 1)[0]);
                await updatePorcelainImage(auth, newPorcelain);
            }
            // change exposure
            newPorcelain.exposure = exposure;

            // overall update
            await updatePorcelain(auth, newPorcelain);

            updateTableData(newPorcelain);
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
                        <h5>更改藏品图</h5>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <span>{`藏品 ID：${payload && payload.id}`}</span>
                        </div>
                        <div className="mb-3">
                            <div className="grid-container">
                                {
                                    images && images.map((src: string, i: number) => (
                                        <ImageSelector key={i} src={src} index={i}
                                            isChecked={i == coverIndex}
                                            removalHandler={removeImage}
                                            selectionHandler={onImageSelected} />
                                    ))
                                }
                                {
                                    images && <ImageUploader maxFiles={20} filesDroppedHandler={onImagesDropped} />
                                }
                            </div>
                        </div>
                        <div className="mb-3">
                            <label>藏品模型</label><br />
                            { 
                                model && (
                                    model.startsWith("blob:") ? 
                                        <h5>来自本地文件：{modelFile.name}</h5> :
                                        <a href={`https://tomortec.github.io/SimpleOnlineModelRenderer/?src=${encodeURIComponent(model)}&exposure=${exposure}`} target="_blank">当前模型：{model}</a>
                                )
                            }
                            <ImageUploader maxFiles={1} acceptType={{ "model/gltf-binary": [".glb", ".gltf"] }}
                                filesDroppedHandler={(url, file) => { 
                                    setModel(url[0]);
                                    setModelFile(file[0]);
                                }} />
                            { model && <i>上传新模型后将会覆盖原有模型</i> }
                        </div>
                        {
                            model &&
                            <div className="mb-3">
                                <label htmlFor="exposureInput" className="form-label">曝光度</label>
                                <input type="number" step={0.01}
                                    id="exposureInput" className="form-control"
                                    value={exposure} onChange={(e) => setExposure(Number(e.currentTarget.value))} />
                            </div>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" disabled={isRequesting} onClick={onConfirm}>保存</button>
                        <button type="button" className="btn" onClick={hideDialog}>关闭</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
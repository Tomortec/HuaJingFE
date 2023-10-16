
import React, { useLayoutEffect, useState, useCallback } from "react";
import { clamp } from "lodash";

import { useDropzone } from "react-dropzone";

import { useModal } from "../hooks/useModal";

export const ImageSelectionModalId = "image-selection-modal";

export interface ImageSelectionModalPayload { 
    porcelainId: string;
    images: string[];
}

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

const ImageUploader = (props: {
    filesDroppedHandler: (fileURLs: string[]) => void
}) => {
    const onDrop = useCallback((files: File[]) => {
        console.log(files);
        props.filesDroppedHandler(files.map((file) => URL.createObjectURL(file)));
    }, []);

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": []
        },
        maxFiles: 20,
        noClick: true,
        noKeyboard: true,
        noDrag: true,
        onDrop
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="new-image-btn btn btn-primary" onClick={open}>
                <i className="bi-plus"></i>
            </div>
        </div>
    )
};

export const ImageSelectionModal = () => {
    const modalId = ImageSelectionModalId;

    const { payload, hideModal }: {
        payload: ImageSelectionModalPayload,
        hideModal: (id: string) => void
    } = useModal();

    const [images, setImages] = useState(null);
    const [coverIndex, setCoverIndex] = useState(0);
    useLayoutEffect(() => {
        if(payload) {
            setImages(payload.images);
        }
    }, [payload]);


    const hideDialog = () => hideModal(`#${modalId}`);

    const removeImage = (i: number) => {
        setCoverIndex(clamp(coverIndex, 0, images.length - 2));
        setImages(
            images.slice(0, i).concat(images.slice(i + 1, images.length))
        );
    };

    const onImageSelected = (i: number) => { setCoverIndex(i); };
    const onImagesDropped = (urls: string[]) => { setImages(images.concat(urls)); };
    const onConfirm = () => {
        console.log(coverIndex);
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
                            <span>{`藏品 ID：${payload && payload.porcelainId}`}</span>
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
                                    images && <ImageUploader filesDroppedHandler={onImagesDropped} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={onConfirm}>保存</button>
                        <button type="button" className="btn" onClick={hideDialog}>关闭</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

import React, { useCallback } from "react";

import { Accept, useDropzone } from "react-dropzone";

export const ImageUploader = (props: {
    maxFiles: number,
    acceptType?: Accept,
    filesDroppedHandler: (fileURLs: string[], files: File[]) => void
}) => {
    const accept = props.acceptType || {
        "image/jpeg": [],
        "image/png": []
    };
    const onDrop = useCallback((files: File[]) => {
        console.log(files);
        props.filesDroppedHandler(files.map((file) => URL.createObjectURL(file)), files);
    }, []);

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: accept,
        maxFiles: props.maxFiles,
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
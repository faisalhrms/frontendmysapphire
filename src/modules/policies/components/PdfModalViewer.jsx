// components/PdfModalViewer.jsx
import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useSecureMedia } from "@modules/media/hooks/mediaHooks.js";

const PdfModalViewer = ({ isOpen, fileId, onClose }) => {
    const { blobUrl, mimeType, loading } = useSecureMedia(fileId, isOpen);

    if (!isOpen) return null;

    const isImage = mimeType.startsWith("image/");

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="bg-white rounded-lg shadow-lg w-[90%] h-[90%] relative">
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="font-bold">Attachment</span>
                    <button className="text-red-600 text-lg" onClick={onClose}>
                        ✖
                    </button>
                </div>
                <div className="p-2 h-[90%] overflow-auto flex justify-center items-center">
                    {loading ? (
                        <p>Loading…</p>
                    ) : blobUrl ? (
                        isImage ? (
                            <img
                                src={blobUrl}
                                alt="attachment"
                                className="max-w-full max-h-full"
                            />
                        ) : (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer fileUrl={blobUrl} />
                            </Worker>
                        )
                    ) : (
                        <p>Error loading file.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PdfModalViewer;
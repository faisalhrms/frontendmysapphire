// components/PdfModalViewer.jsx
import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfModalViewer = ({ isOpen, onClose, fileUrl, fileName }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="bg-white rounded-lg shadow-lg w-[90%] h-[90%] relative">
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="font-bold">{fileName}</span>
                    <button
                        className="text-red-600 text-lg"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>
                <div className="p-2 h-[90%] overflow-hidden">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">                        <Viewer fileUrl={fileUrl} />
                    </Worker>
                </div>
            </div>
        </div>
    );
};

export default PdfModalViewer;

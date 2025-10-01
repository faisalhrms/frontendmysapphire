import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useSecureMedia } from "@modules/media/hooks/mediaHooks.js";
import {
    X, ZoomIn, ZoomOut, Maximize2, Minimize2,
    FileText, Camera, Loader2, ShieldAlert
} from "lucide-react";

const PdfModalViewer = ({ isOpen, fileId, onClose, isConfidential = true }) => {
    const { blobUrl, mimeType, loading } = useSecureMedia(fileId, isOpen);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(100);

    useEffect(() => {
        if (!isOpen) return;

        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'c'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const isImage = mimeType?.startsWith("image/");
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
    const handleResetZoom = () => setZoom(100);
    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center select-none">
            <div className={`bg-white rounded-lg shadow-2xl relative transition-all duration-300 flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-[95%] h-[95%] max-w-7xl'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50  dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                            {isImage ? <Camera className="h-4 w-4 text-primary dark:text-gray-200 dark:bg-bodybg" /> : <FileText className="h-4 w-4 text-primary dark:text-gray-200 dark:bg-bodybg" />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Secure Document Viewer</h3>
                            <p className="text-sm text-gray-500">{isImage ? 'Image File' : 'PDF Document'}</p>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center space-x-2">
                        {isImage &&
                            <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
                                <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded" title="Zoom Out">
                                    <ZoomOut className="h-4 w-4 text-gray-600" />
                                </button>
                                <button onClick={handleResetZoom} className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded min-w-[50px]" title="Reset Zoom">
                                    {zoom}%
                                </button>
                                <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded" title="Zoom In">
                                    <ZoomIn className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        }
                        <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-100 rounded-lg" title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                            {isFullscreen ? <Minimize2 className="h-4 w-4 text-gray-600" /> : <Maximize2 className="h-4 w-4 text-gray-600" />}
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-danger/10 rounded-lg" title="Close">
                            <X className="h-4 w-4 text-red" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 h-[calc(100%-73px-41px)] relative overflow-hidden bg-gray-100  dark:text-gray-200 dark:bg-bodybg">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                            <p className="text-gray-600">Loading document...</p>
                        </div>
                    ) : blobUrl ? (
                        <div className="h-full w-full overflow-auto relative">
                            {
                                isConfidential &&
                                <div className="absolute inset-0 pointer-events-none opacity-10 text-6xl font-bold flex items-center justify-center text-gray-700 select-none z-[49]">
                                    CONFIDENTIAL
                                </div>
                            }
                            {isImage ? (
                                <div className="flex justify-center items-center h-full p-4">
                                    <img
                                        src={blobUrl}
                                        alt="Secure Document"
                                        style={{ transform: `scale(${zoom / 100})` }}
                                        className="max-w-full max-h-full object-contain shadow-lg rounded-lg transition-transform duration-200"
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                </div>
                            ) : (
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={blobUrl} />
                                </Worker>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2  dark:text-gray-200 dark:bg-bodybg">Failed to load document</h3>
                            <p className="text-gray-600  dark:text-gray-200 dark:bg-bodybg">The document could not be loaded. Please try again.</p>
                            <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Close</button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600  dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center space-x-2 text-red-600 font-medium">
                        <ShieldAlert className="h-4 w-4" />
                        <span>Secure Mode Enabled</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span>Status: {loading ? 'Loading...' : 'Ready'}</span>
                        {isImage && <>
                            <span>•</span>
                            <span>Zoom: {zoom}%</span>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfModalViewer;

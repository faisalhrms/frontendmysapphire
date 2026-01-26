// src/modules/inlay/components/InlayDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ChevronLeft,
    Edit,
    Calendar,
    CheckCircle2,
    XCircle,
    Layers,
    Maximize2,
    Download,
    FileImage
} from "lucide-react";

// Assuming you have a custom hook file as mentioned
import { useInlay } from "@modules/inlay/hooks/inlayHooks";

const InlayDetail = () => {
    const { id } = useParams();
    const { inlay, loading } = useInlay(id);

    // State to manage the currently displayed large image
    const [activeImage, setActiveImage] = useState(null);

    // Update active image when inlay data loads
    useEffect(() => {
        if (inlay?.thumbnail?.medium_url) {
            setActiveImage(inlay.thumbnail);
        } else if (inlay?.attachments?.length > 0) {
            setActiveImage(inlay.attachments[0]);
        }
    }, [inlay]);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                <div className="text-textmuted text-sm font-inter">Loading Inlay Details...</div>
            </div>
        );
    }

    // --- Not Found State ---
    if (!inlay) {
        return (
            <div className="p-6 text-center">
                <h3 className="text-lg font-Montserrat font-bold text-gray-800 dark:text-white">Inlay not found</h3>
                <Link to="/inlay" className="text-primary hover:underline mt-2 inline-block">Go Back</Link>
            </div>
        );
    }

    return (
        <div className="font-inter py-5">
            {/* Page Header / Breadcrumb Area */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        to="/module/inlay"
                        className="p-2 rounded-full bg-white dark:bg-bodybg2 text-gray-500 hover:text-primary shadow-defaultshadow transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h4 className="font-Montserrat font-bold text-xl text-gray-800 dark:text-white leading-tight">
                            {inlay.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-textmuted mt-1">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">
                                {inlay.design_code}
                            </span>
                            <span>•</span>
                            <span>Created {new Date(inlay.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/module/inlay/edit/${id}`}
                    className="ti-btn bg-primary text-white hover:bg-primary/90 flex items-center gap-2 px-4 py-2 rounded-md shadow-lg shadow-primary/20 transition-all"
                >
                    <Edit size={16} /> <span className="hidden sm:inline">Edit Inlay</span>
                </Link>
            </div>

            <div className="grid grid-cols-12 gap-6">

                {/* --- LEFT COLUMN: IMAGE GALLERY --- */}
                <div className="col-span-12 xl:col-span-5">
                    <div className="box border-none shadow-defaultshadow bg-white dark:bg-bodybg2 h-full">
                        <div className="box-body p-4">

                            {/* Main Active Image */}
                            <div className="relative group w-full aspect-[4/5] bg-gray-100 dark:bg-black/20 rounded-xl overflow-hidden mb-4 border border-defaultborder">
                                {activeImage ? (
                                    <>
                                        <img
                                            src={activeImage.medium_url || activeImage.file_url}
                                            alt={activeImage.file_name}
                                            className="w-full h-full object-contain p-2"
                                        />

                                        {/* Overlay Actions */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <a
                                                href={activeImage.file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 bg-white/90 text-gray-700 hover:text-primary rounded-full shadow-sm backdrop-blur-sm"
                                                title="View Full Size"
                                            >
                                                <Maximize2 size={16} />
                                            </a>
                                            <a
                                                href={activeImage.file_url}
                                                download
                                                className="p-2 bg-white/90 text-gray-700 hover:text-primary rounded-full shadow-sm backdrop-blur-sm"
                                                title="Download"
                                            >
                                                <Download size={16} />
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center text-textmuted">
                                        <FileImage size={48} className="mb-2 opacity-50" />
                                        <span>No image available</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {inlay.attachments && inlay.attachments.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Gallery ({inlay.attachments.length})</p>
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {inlay.attachments.map((att) => (
                                            <button
                                                key={att.id}
                                                onClick={() => setActiveImage(att)}
                                                className={`
                                                    relative min-w-[70px] h-[70px] rounded-lg overflow-hidden border-2 transition-all
                                                    ${activeImage?.id === att.id
                                                    ? "border-primary ring-2 ring-primary/20 ring-offset-1"
                                                    : "border-transparent opacity-70 hover:opacity-100"}
                                                `}
                                            >
                                                <img
                                                    src={att.small_url || att.file_url}
                                                    alt="thumb"
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: DETAILS --- */}
                <div className="col-span-12 xl:col-span-7 space-y-6">

                    {/* Status & Basic Info Card */}
                    <div className="box border-none shadow-defaultshadow bg-white dark:bg-bodybg2">
                        <div className="box-header !border-b !border-defaultborder py-3 px-5">
                            <h5 className="box-title font-Montserrat font-bold text-base">Overview</h5>
                        </div>
                        <div className="box-body p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-textmuted uppercase font-semibold">Status</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        {inlay.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                                                <CheckCircle2 size={14} /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-500 border border-gray-300">
                                                <XCircle size={14} /> Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-textmuted uppercase font-semibold">System ID</label>
                                    <div className="mt-1 font-mono text-sm text-gray-700 dark:text-gray-300">
                                        #{inlay.id}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-textmuted uppercase font-semibold">Design Code</label>
                                    <div className="mt-1 text-base font-bold text-gray-800 dark:text-white">
                                        {inlay.design_code}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-textmuted uppercase font-semibold">Last Updated</label>
                                    <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar size={14} className="text-primary" />
                                        {inlay.updated_at
                                            ? new Date(inlay.updated_at).toLocaleDateString() + " " + new Date(inlay.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                            : "Not updated yet"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attributes List */}
                    <div className="box border-none shadow-defaultshadow bg-white dark:bg-bodybg2">
                        <div className="box-header !border-b !border-defaultborder py-3 px-5 flex items-center gap-2">
                            <Layers size={18} className="text-secondary" />
                            <h5 className="box-title font-Montserrat font-bold text-base">Specifications</h5>
                        </div>
                        <div className="box-body p-0">
                            {inlay.description && inlay.description.length > 0 ? (
                                <div className="divide-y divide-dashed divide-defaultborder">
                                    {inlay.description.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-12 px-5 py-4 hover:bg-gray-50 dark:hover:bg-black/5 transition-colors"
                                        >
                                            <div className="col-span-5 sm:col-span-4 text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center">
                                                {item.label}
                                            </div>
                                            <div className="col-span-7 sm:col-span-8 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-5 text-sm text-textmuted italic">
                                    No specifications added for this inlay.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* File Info Summary */}
                    {activeImage && (
                        <div className="p-4 rounded-lg bg-info/5 border border-info/10 flex items-start gap-3">
                            <div className="mt-1 p-2 bg-white rounded-full text-info shadow-sm">
                                <FileImage size={18} />
                            </div>
                            <div>
                                <h6 className="text-sm font-bold text-gray-800 dark:text-gray-200">Current Image Details</h6>
                                <ul className="mt-1 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                    <li><span className="font-semibold">Filename:</span> {activeImage.file_name}.{activeImage.file_extension}</li>
                                    <li><span className="font-semibold">Dimensions:</span> {activeImage.file_width} x {activeImage.file_height} px</li>
                                    <li><span className="font-semibold">Size:</span> {(activeImage.file_size / 1024 / 1024).toFixed(2)} MB</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InlayDetail;
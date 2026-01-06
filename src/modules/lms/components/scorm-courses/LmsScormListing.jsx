import React, { useMemo, useState, useEffect, useCallback } from "react";
import api from "@config/axiosConfig";
import DataTable from "@components/datatable/DataTable.jsx";
import FileUpload from "@components/FileUpload.jsx";

import { useForm } from "react-hook-form";
import FormInput from "@components/form/FormInput.jsx";

function getDjangoBase() {
    return (import.meta.env.VITE_DJANGO_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
}

function buildLaunchUrl(detail) {
    if (!detail) return "";

    const base = getDjangoBase();
    const lu = detail?.launch_url;
    if (lu) {
        if (/^https?:\/\//i.test(lu)) return lu;
        const rel = String(lu).replace(/^\/+/, "");
        return `${base}/${rel}`;
    }

    const storagePath = String(detail?.storage_path || "")
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
    const launchPath = String(detail?.launch_path || "").replace(/^\/+/, "");

    if (!storagePath || !launchPath) return "";
    return `${base}/media/${storagePath}/${launchPath}`;
}

// ✅ local cleanup to kill HS overlay blur/backdrop if left behind
function cleanupHsOverlay() {
    try {
        document.querySelectorAll(".hs-overlay-backdrop").forEach((el) => el.remove());
        document.documentElement.classList.remove("hs-overlay-open");
        document.body.classList.remove("hs-overlay-open");

        document.documentElement.classList.remove("overflow-hidden");
        document.body.classList.remove("overflow-hidden");

        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
    } catch (e) {

    }
}

export default function LmsScorm({ isActive: componentActive = true }) {
    if (!componentActive) return null;

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [advancedFilters, setAdvancedFilters] = useState([]);

    const [selectedZip, setSelectedZip] = useState(null);
    const [existingZipName, setExistingZipName] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    const [showPlayer, setShowPlayer] = useState(false);
    const [playerTitle, setPlayerTitle] = useState("");
    const [playerUrl, setPlayerUrl] = useState("");
    const [playerLoading, setPlayerLoading] = useState(false);
    const [playerError, setPlayerError] = useState("");

    const [attachmentId, setAttachmentId] = useState(null);
    const [attachmentObj, setAttachmentObj] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            scorm_version: "1.2", // ✅ ADDED default
            is_active: true,
            attachment_id: null,
        },
    });

    const title = watch("title");
    const scormVersion = watch("scorm_version"); // ✅ ADDED
    const isActive = watch("is_active");
    const attachmentIdWatch = watch("attachment_id");

    // ✅ run cleanup on mount/unmount too (safe)
    useEffect(() => {
        cleanupHsOverlay();
        return () => cleanupHsOverlay();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        reset({ title: "", scorm_version: "1.2", is_active: true, attachment_id: null }); // ✅ include version
        setSelectedZip(null);
        setExistingZipName("");
        setAttachmentId(null);
        setAttachmentObj(null);
    };

    const openAddModal = () => {
        cleanupHsOverlay();
        resetForm();
        setShowModal(true);
    };

    const closeModal = useCallback(() => {
        setShowModal(false);
        setLoading(false);
        resetForm();
        cleanupHsOverlay(); // ✅ important
    }, [reset]);

    const closePlayer = () => {
        setShowPlayer(false);
        setPlayerTitle("");
        setPlayerUrl("");
        setPlayerError("");
        setPlayerLoading(false);
        cleanupHsOverlay();
    };

    const handleEdit = async (id) => {
        try {
            cleanupHsOverlay();
            const res = await api.get(`/lms/scorm-packages/${id}/`);
            const scorm = res.data?.data;

            const first = Array.isArray(scorm?.attachments) ? scorm.attachments[0] : null;

            setAttachmentId(first?.id || null);
            setAttachmentObj(first || null);

            reset({
                title: scorm?.title || "",
                scorm_version: scorm?.scorm_version || "1.2", // ✅ ADDED
                is_active: Boolean(scorm?.is_active),
                attachment_id: first?.id || null,
            });

            if (scorm?.zip_file) {
                let fileName = scorm.zip_file;
                if (typeof fileName === "string") {
                    fileName = fileName.split("/").pop();
                    fileName = fileName.split("\\").pop();
                }
                setExistingZipName(fileName);
            } else {
                setExistingZipName("");
            }

            setSelectedZip(null);
            setEditingId(id);
            setShowModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * ✅ FIXED PLAY:
     * Use EXACT same URL building as your working "story.html" code:
     *    VITE_API_BASE_URL + detail.launch_url
     * This supports launch_url like:
     *    /api/lms/media/lms/scorm/extracted/.../story.html
     */
    const handlePlay = async (pkg) => {
        try {
            cleanupHsOverlay();
            setPlayerLoading(true);
            setPlayerError("");
            setPlayerTitle(pkg?.title || "SCORM Player");
            setPlayerUrl("");
            setShowPlayer(true);

            const res = await api.get(`/lms/scorm-packages/${pkg.id}/`);
            const detail = res.data?.data;

            const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
            const rel = String(detail?.launch_url || "").replace(/^\/+/, "");
            const url = base ? `${base}/${rel}` : (detail?.launch_url || "");

            if (!url) {
                setPlayerError("No SCORM URL found.");
                setPlayerUrl("");
                return;
            }

            setPlayerUrl(url);
        } catch (err) {
            console.error("Play error:", err.response?.data || err);
            setPlayerError(err.response?.data?.message || "Failed to load SCORM content");
            setPlayerUrl("");
        } finally {
            setPlayerLoading(false);
            cleanupHsOverlay();
        }
    };

    useEffect(() => {
        if (!attachmentIdWatch) {
            setAttachmentId(null);
            setAttachmentObj(null);
            return;
        }
        setAttachmentId(attachmentIdWatch);

        // ✅ FileUpload selection often leaves HS backdrop; cleanup after value updates
        cleanupHsOverlay();
    }, [attachmentIdWatch]);

    const onSubmit = async (values) => {
        if (!values.title?.trim()) {
            alert("Please enter title");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", values.title.trim());

            // ✅ ADDED: scorm_version
            formData.append("scorm_version", values.scorm_version || "1.2");

            formData.append("is_active", values.is_active ? "true" : "false");

            if (selectedZip) formData.append("zip_file", selectedZip);

            if (values?.attachment_id) {
                formData.append("attachment_ids", String(values.attachment_id)); // backend expects attachment_ids
            }

            if (editingId) {
                await api.put(`/lms/scorm-packages/${editingId}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.post(`/lms/scorm-packages/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setReloadKey((prev) => prev + 1);
            closeModal();
        } catch (err) {
            console.error("Save error:", err.response?.data || err);
            setLoading(false);
            cleanupHsOverlay();
        }
    };

    const handleZipChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setSelectedZip(file);
    };

    const clearZip = () => {
        setSelectedZip(null);
        const fileInput = document.getElementById("scorm-zip-input");
        if (fileInput) fileInput.value = "";
    };

    const buttons = [
        <button
            key="add-scorm"
            onClick={openAddModal}
            className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle"></i> Add SCORM
        </button>,
    ];

    const columns = useMemo(
        () => [
            { accessor: "title", Header: "Title", filterable: true },

            // ✅ ADDED column
            {
                accessor: "scorm_version",
                Header: "SCORM Version",
                filterable: true,
                Cell: ({ row }) => (
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        {row.original.scorm_version === "2004" ? "2004" : "1.2"}
                    </span>
                ),
            },

            {
                accessor: "is_active",
                Header: "Active",
                filterable: true,
                Cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            row.original.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {row.original.is_active ? "Yes" : "No"}
                    </span>
                ),
            },
            { accessor: "created_at", Header: "Created At" },
            {
                Header: "Actions",
                accessor: "id",
                filterable: true,
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex justify-center space-x-2">
                        <button
                            onClick={() => handlePlay(row.original)}
                            className="ti-btn ti-btn-success ti-btn-sm flex items-center justify-center"
                            title="Play"
                        >
                            <i className="ri-play-circle-line text-lg"></i>
                        </button>

                        <button
                            onClick={() => handleEdit(row.original.id)}
                            className="ti-btn ti-btn-primary ti-btn-sm flex items-center justify-center"
                            title="Edit"
                        >
                            <i className="ri-edit-line text-lg"></i>
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <div className="p-4">
            {/* Player Modal */}
            {showPlayer && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 dark:text-gray-200 dark:bg-bodybg">
                        <div className="ti-modal-header flex justify-between items-center p-4 border-b">
                            <h6 className="modal-title text-lg font-semibold">{playerTitle}</h6>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 text-xl"
                                onClick={closePlayer}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <div className="ti-modal-body p-4">
                            {playerError ? (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{playerError}</div>
                            ) : playerLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                                    <p className="mt-4 text-sm text-gray-600">Loading SCORM content...</p>
                                </div>
                            ) : playerUrl ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b font-mono break-all">
                                        {playerUrl}
                                    </div>
                                    <iframe
                                        src={playerUrl}
                                        title="SCORM Player"
                                        className="w-full h-[75vh] border-0"
                                        allow="autoplay; fullscreen"
                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
                                        loading="eager"
                                        onError={() => {
                                            setPlayerError(
                                                "Failed to load SCORM content. File might be missing or blocked by browser."
                                            );
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                                    No SCORM URL found.
                                </div>
                            )}
                        </div>

                        <div className="ti-modal-footer flex justify-end gap-2 p-4 border-t">
                            <button
                                type="button"
                                onClick={closePlayer}
                                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 dark:text-gray-200 dark:bg-bodybg">
                        <div className="ti-modal-header flex justify-between items-center p-4 border-b">
                            <h6 className="modal-title text-lg font-semibold">{editingId ? "Edit SCORM" : "Add SCORM"}</h6>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 text-xl"
                                onClick={closeModal}
                                disabled={loading}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="ti-modal-body p-4">
                                <div className="space-y-4">
                                    <FormInput
                                        name="title"
                                        control={control}
                                        errors={errors}
                                        placeholder="Enter title"
                                        is_required={true}
                                    />

                                    {/* ✅ ADDED: SCORM Version Select */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">SCORM Version</label>
                                        <select
                                            value={scormVersion || "1.2"}
                                            onChange={(e) => setValue("scorm_version", e.target.value)}
                                            disabled={loading}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:text-gray-200 dark:bg-bodybg"
                                        >
                                            <option value="1.2">SCORM 1.2</option>
                                            <option value="2004">SCORM 2004</option>
                                        </select>
                                        {errors?.scorm_version && (
                                            <p className="text-xs text-red-600 mt-1">{errors.scorm_version.message}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            checked={!!isActive}
                                            onChange={(e) => setValue("is_active", e.target.checked)}
                                            disabled={loading}
                                            className="h-4 w-4"
                                        />
                                        <label htmlFor="is_active" className="text-sm font-medium">
                                            Active
                                        </label>
                                    </div>

                                    <FileUpload
                                        type="image"
                                        modalId="scormMediaModal"
                                        inputName="attachment_id"
                                        currentValue={attachmentId}
                                        file={attachmentObj || {}}
                                        control={control}
                                        errors={errors}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium mb-1">ZIP File</label>
                                        <input
                                            id="scorm-zip-input"
                                            type="file"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2 dark:text-gray-200 dark:bg-bodybg"
                                            onChange={handleZipChange}
                                            disabled={loading}
                                            accept=".zip"
                                        />

                                        {editingId && existingZipName && !selectedZip && (
                                            <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                                                <p className="text-sm text-blue-700 mb-1">
                                                    <i className="ri-file-zip-line mr-1"></i>
                                                    Current file: <span className="font-medium">{existingZipName}</span>
                                                </p>
                                                <p className="text-xs text-blue-600">Upload a new zip above to replace this one</p>
                                            </div>
                                        )}

                                        {selectedZip && (
                                            <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-green-700 mb-1">
                                                            <i className="ri-file-upload-line mr-1"></i>
                                                            New file: <span className="font-medium">{selectedZip.name}</span>
                                                        </p>
                                                        <p className="text-xs text-green-600">
                                                            Size: {(selectedZip.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={clearZip}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                        disabled={loading}
                                                    >
                                                        <i className="ri-close-circle-line text-lg"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="ti-modal-footer flex justify-end gap-2 p-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || !title?.trim()}
                                    className={`hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] ${
                                        loading || !title?.trim() ? "cursor-not-allowed" : ""
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                                            Saving...
                                        </span>
                                    ) : editingId ? (
                                        "Update SCORM"
                                    ) : (
                                        "Add SCORM"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DataTable
                key={reloadKey}
                columns={columns}
                title="SCORM Packages"
                buttons={buttons}
                apiUrl="/lms/scorm-packages/datatable/"
                enableAdvancedFilters={true}
                advancedFilters={advancedFilters}
                setAdvancedFilters={setAdvancedFilters}
            />
        </div>
    );
}

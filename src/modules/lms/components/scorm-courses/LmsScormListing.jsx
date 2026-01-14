import React, {useMemo, useState, useEffect, useCallback, useRef} from "react";
import api from "@config/axiosConfig";
import DataTable from "@components/datatable/DataTable.jsx";

import { useForm } from "react-hook-form";
import FormInput from "@components/form/FormInput.jsx";

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

    const [selectedZip, setSelectedZip] = useState(null);
    const [existingZipName, setExistingZipName] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

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
            scorm_version: "1.2",
            is_active: true,
        },
    });

    const title = watch("title");
    const scormVersion = watch("scorm_version");
    const isActive = watch("is_active");

    useEffect(() => {
        cleanupHsOverlay();
        return () => cleanupHsOverlay();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        reset({ title: "", scorm_version: "1.2", is_active: true });
        setSelectedZip(null);
        setExistingZipName("");
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
        cleanupHsOverlay();
    }, [reset]);

    const handleEdit = async (id) => {
        try {
            cleanupHsOverlay();
            const res = await api.get(`/lms/scorm-packages/${id}/`);
            const scorm = res.data?.data;

            reset({
                title: scorm?.title || "",
                scorm_version: scorm?.scorm_version || "1.2",
                is_active: Boolean(scorm?.is_active),
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

    const onSubmit = async (values) => {
        if (!values.title?.trim()) {
            alert("Please enter title");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", values.title.trim());

            formData.append("scorm_version", values.scorm_version || "1.2");

            formData.append("is_active", values.is_active ? "true" : "false");

            if (selectedZip) formData.append("zip_file", selectedZip);

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
                Cell: ({value}) => (value ? 'Yes': 'No'),
                getCellProps: (cellInfo) => {
                    return {
                        className: cellInfo.value ? 'bg-success text-white' : 'bg-info text-white',
                    }
                },
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 dark:text-gray-200 dark:bg-bodybg">
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
                buttons={buttons}
                apiUrl="/lms/scorm-packages/datatable/"
                enableAdvancedFilters={true}
            />
        </div>
    );
}

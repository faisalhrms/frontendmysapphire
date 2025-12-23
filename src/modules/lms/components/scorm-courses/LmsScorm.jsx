import React, { useState } from "react";
import api from "@config/axiosConfig";
import DataTable from "@components/datatable/DataTable.jsx";

export default function LmsScorm() {
    const [filters, setFilters] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState("");
    const [scormVersion, setScormVersion] = useState("1.2");
    const [isActive, setIsActive] = useState(true);

    const [selectedFile, setSelectedFile] = useState(null);
    const [existingFileName, setExistingFileName] = useState("");

    const [reloadKey, setReloadKey] = useState(0);

    const columns = [
        { accessor: "title", Header: "Title" },
        { accessor: "scorm_version", Header: "SCORM Version" },
        {
            accessor: "checksum",
            Header: "Checksum",
            Cell: ({ row }) => (
                <span className="font-mono text-xs">
          {(row.original.checksum || "").slice(0, 14)}...
        </span>
            ),
        },
        {
            accessor: "is_active",
            Header: "Active",
            Cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded text-xs ${
                        row.original.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
          {row.original.is_active ? "Yes" : "No"}
        </span>
            ),
        },
        {
            Header: "Uploaded By",
            accessor: "uploaded_by",
            Cell: ({ row }) => (
                <span className="text-sm">
          {row.original.uploaded_by?.full_name || "-"}
        </span>
            ),
        },
        { accessor: "created_at", Header: "Created At" },
        {
            Header: "Actions",
            accessor: "id",
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
    ];

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setScormVersion("1.2");
        setIsActive(true);
        setSelectedFile(null);
        setExistingFileName("");
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        resetForm();
    };

    const handleEdit = async (id) => {
        try {
            const res = await api.get(`/lms/scorm-packages/${id}/`);
            const scorm = res.data?.data;

            setTitle(scorm?.title || "");
            setScormVersion(scorm?.scorm_version || "1.2");
            setIsActive(Boolean(scorm?.is_active));

            if (scorm?.zip_file) {
                let fileName = scorm.zip_file;
                if (typeof fileName === "string") {
                    fileName = fileName.split("/").pop();
                    fileName = fileName.split("\\").pop();
                }
                setExistingFileName(fileName);
            } else {
                setExistingFileName("");
            }

            setSelectedFile(null);
            setEditingId(id);
            setShowModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert("Please enter title");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("scorm_version", scormVersion);
            formData.append("is_active", isActive ? "true" : "false");

            // only send file if user selected a new one
            if (selectedFile) formData.append("zip_file", selectedFile);

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
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        const fileInput = document.querySelector('input[type="file"]');
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

    return (
        <div className="p-4">


            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 dark:text-gray-200 dark:bg-bodybg">
                        <div className="ti-modal-header flex justify-between items-center p-4 border-b">
                            <h6 className="modal-title text-lg font-semibold">
                                {editingId ? "Edit SCORM" : "Add SCORM"}
                            </h6>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 text-xl"
                                onClick={closeModal}
                                disabled={loading}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <div className="ti-modal-body p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:text-gray-200 dark:bg-bodybg"
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        SCORM Version <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:text-gray-200 dark:bg-bodybg"
                                        placeholder="Enter 1.2 or 2004"
                                        value={scormVersion}
                                        onChange={(e) => setScormVersion(e.target.value)}
                                        disabled={loading}
                                    />

                                    {scormVersion && !["1.2", "2004"].includes(scormVersion) && (
                                        <p className="text-xs text-red-500 mt-1">Allowed values: 1.2 or 2004</p>
                                    )}
                                </div>



                                <div className="flex items-center gap-3">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        disabled={loading}
                                        className="h-4 w-4"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium">
                                        Active
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        ZIP File
                                    </label>
                                    <input
                                        type="file"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2 dark:text-gray-200 dark:bg-bodybg"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                        accept=".zip"
                                    />

                                    {editingId && existingFileName && !selectedFile && (
                                        <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                                            <p className="text-sm text-blue-700 mb-1">
                                                <i className="ri-file-zip-line mr-1"></i>
                                                Current file:{" "}
                                                <span className="font-medium">{existingFileName}</span>
                                            </p>
                                            <p className="text-xs text-blue-600">
                                                Upload a new zip above to replace this one
                                            </p>
                                        </div>
                                    )}

                                    {selectedFile && (
                                        <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-green-700 mb-1">
                                                        <i className="ri-file-upload-line mr-1"></i>
                                                        New file:{" "}
                                                        <span className="font-medium">
                              {selectedFile.name}
                            </span>
                                                    </p>
                                                    <p className="text-xs text-green-600">
                                                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                                        MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearFile}
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
                                type="button"
                                onClick={handleSave}
                                disabled={loading || !title.trim()}
                                className={`hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] ${
                                    loading || !title.trim() ? "cursor-not-allowed" : ""
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
                    </div>
                </div>
            )}

            <DataTable
                key={reloadKey}
                columns={columns}
                title="SCORM Packages"
                buttons={buttons}
                apiUrl="/lms/scorm-packages/datatable"
                filter={filters}
            />
        </div>
    );
}

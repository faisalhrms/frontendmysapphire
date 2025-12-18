import React, { useState, useRef } from "react";
import api from "@config/axiosConfig";
import DataTable from "@components/datatable/DataTable.jsx";

export default function LmsCourse() {
    const [filters, setFilters] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingFileName, setExistingFileName] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    const columns = [
        { accessor: "title", Header: "Course Title" },
        { accessor: "zip_file", Header: "ZIP File" },
        { accessor: "extracted_path", Header: "Extracted Folder" },
        { accessor: "video_file", Header: "Video File" },
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => handleEdit(row.original.id)}
                        className="ti-btn ti-btn-primary ti-btn-sm flex items-center justify-center"
                    >
                        <i className="ri-edit-line text-lg"></i>
                    </button>
                </div>
            ),
        },
    ];

    const handleEdit = async (id) => {
        try {
            const res = await api.get(`/lms/course/${id}/`);
            const course = res.data.data;

            setTitle(course.title || "");

            if (course.zip_file) {
                let fileName = course.zip_file;
                if (typeof course.zip_file === 'string') {
                    fileName = course.zip_file.split('/').pop();
                    fileName = fileName.split('\\').pop();
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
            alert("Please enter a course title");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);

            if (selectedFile) {
                formData.append("zip_file", selectedFile);
            }

            if (editingId) {
                await api.put(`/lms/course/${editingId}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {

                await api.post("/lms/course/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setReloadKey(prev => prev + 1);

            setShowModal(false);
            setEditingId(null);
            setTitle("");
            setSelectedFile(null);
            setExistingFileName("");
            setLoading(false);

        } catch (err) {
            console.error("Save error:", err);

            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setTitle("");
        setSelectedFile(null);
        setExistingFileName("");
        setLoading(false);
    };

    const buttons = [
        <button
            key="add-course"
            onClick={() => {
                setShowModal(true);
                setEditingId(null);
                setTitle("");
                setSelectedFile(null);
                setExistingFileName("");
            }}
            className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle"></i> Add Course
        </button>,
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">LMS Courses</h2>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 dark:text-gray-200 dark:bg-bodybg">
                        <div className="ti-modal-header flex justify-between items-center p-4 border-b">
                            <h6 className="modal-title text-lg font-semibold">
                                {editingId ? "Edit Course" : "Add Course"}
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
                                    <label className="block text-sm font-medium  mb-1">
                                        Course Title *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:text-gray-200 dark:bg-bodybg"
                                        placeholder="Enter course title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium  mb-1">
                                        ZIP File
                                    </label>
                                    <input
                                        type="file"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2 dark:text-gray-200 dark:bg-bodybg"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                        accept=".zip,.rar,.7z"
                                    />

                                    {editingId && existingFileName && !selectedFile && (
                                        <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                                            <p className="text-sm text-blue-700 mb-1">
                                                <i className="ri-file-zip-line mr-1"></i>
                                                Current file: <span className="font-medium">{existingFileName}</span>
                                            </p>
                                            <p className="text-xs text-blue-600">
                                                Upload a new file above to replace this one
                                            </p>
                                        </div>
                                    )}

                                    {selectedFile && (
                                        <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-green-700 mb-1">
                                                        <i className="ri-file-upload-line mr-1"></i>
                                                        New file: <span className="font-medium">{selectedFile.name}</span>
                                                    </p>
                                                    <p className="text-xs text-green-600">
                                                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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
                                className={`phs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]${
                                    loading || !title.trim()
                                        ? 'ti-btn-primary-full  cursor-not-allowed'
                                        : 'bti-btn-primary-full  hover:bg-blue-700'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                                        Saving...
                                    </span>
                                ) : (
                                    editingId ? "Update Course" : "Add Course"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DataTable
                key={reloadKey}
                columns={columns}
                title="Courses"
                buttons={buttons}
                apiUrl="/lms/course/datatable"
                filter={filters}
            />
        </div>
    );
}
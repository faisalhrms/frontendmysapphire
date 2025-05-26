import React, { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Pagination from "@components/Pagination.jsx";
import { useMediaFiles, useMediaFileUpload } from "@modules/media/hooks/mediaHooks.js";
import FileMeta from "@modules/media/components/FileMeta.jsx";
import FileItem from "@modules/media/components/FileItem.jsx";
import "@assets/css/custom/media.css";
import { useSearchHook } from "@hooks/useSearchHook.js";
import MediaHeader from "@modules/media/components/MediaHeader.jsx";

const MediaList = ({ needFileMeta = true, multiSelect = true, needSelectedValue = false, onSelectionChange, type = '' }) => {
    const { uploadFiles, uploading } = useMediaFileUpload();
    const { searchTerm, currentPage, setCurrentPage, handleSearchChange } = useSearchHook();
    const { data, isLoading, refetch } = useMediaFiles(currentPage, 12, searchTerm, type);
    const [filesList, setFilesList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileMeta, setFileMeta] = useState(null);
    const [totalFilesCount, setTotalFilesCount] = useState(0);
    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, [setCurrentPage]);
    const onFileChange = useCallback(async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const uploadedFiles = await uploadFiles(files);
            if (uploadedFiles) {
                setFilesList((prevFiles) => [...uploadedFiles, ...prevFiles]);
                setTotalFilesCount((prevCount) => prevCount + uploadedFiles.length);
            }
        }
        e.target.value = "";
    }, [uploadFiles]);

    useEffect(() => {
        if (data?.rows) {
            setFilesList(data.rows);
            if (data.rows.length > 0) {
                const firstFile = data.rows[0];
                setSelectedFiles([firstFile.id]);
                setTotalFilesCount(data.total);
                if (needFileMeta) {
                    setFileMeta(firstFile);
                }
            } else {
                setSelectedFiles([]);
                setFileMeta(null);
            }
        }
    }, [data, needFileMeta]);

    const toggleFileSelection = useCallback((fileId) => {
        if (multiSelect) {
            setSelectedFiles((prevSelected) => {
                const isSelected = prevSelected.includes(fileId);
                const newSelected = isSelected
                    ? prevSelected.filter((id) => id !== fileId)
                    : [...prevSelected, fileId]; // Select file

                if (needFileMeta) {
                    setFileMeta(newSelected.length ? filesList.find((file) => file.id === newSelected[newSelected.length - 1]) : null);
                }

                return newSelected;
            });
        } else {
            setSelectedFiles([fileId]);
            if (needFileMeta) {
                setFileMeta(filesList.find((file) => file.id === fileId) || null);
            }
        }
    }, [filesList, multiSelect, needFileMeta]);

    const totalPages = Math.ceil(data?.total / 12) || 0;

    const handleSubmit = useCallback(() => {
        if (onSelectionChange) {
            onSelectionChange({ ids: selectedFiles, files: filesList.filter((file) => selectedFiles.includes(file.id)) });
        }
    }, [onSelectionChange, selectedFiles, filesList]);

    return (
        <div className="file-manager-container p-2 gap-2 sm:!flex !block text-defaulttextcolor text-defaultsize">
            <div className="file-manager-folders">
                <MediaHeader
                    handleSearchChange={handleSearchChange}
                    totalFiles={totalFilesCount}
                    onFileChange={onFileChange}
                    selectedFilesCount={selectedFiles.length}
                    needSelectedValue={needSelectedValue}
                    handleSubmit={handleSubmit}
                    selectedFiles={selectedFiles}
                    refetch={refetch}
                />
                {isLoading || uploading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="p-4 file-folders-container" id="file-folders-container">
                        <div className="grid grid-cols-12 gap-x-6 mb-4">
                            {filesList.map((file) => (
                                <div
                                    className={`border dark:border-defaultborder/10 inner mb-3
                                        ${needFileMeta && fileMeta ? 'xxl:col-span-3 xl:col-span-4 lg:col-span-4 md:col-span-4' : 'xxl:col-span-2 xl:col-span-3 lg:col-span-3 md:col-span-3'}
                                        ${selectedFiles.includes(file.id) ? 'active' : ''}`}
                                    key={file.id}
                                    onClick={() => toggleFileSelection(file.id)}
                                >
                                    <FileItem file={file} />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-12 gap-x-6">
                            <Pagination
                                mb={0}
                                justify='center'
                                currentPage={currentPage}
                                totalPages={totalPages}
                                paginationDisabled={isLoading}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                )}
            </div>
            {needFileMeta && fileMeta && <FileMeta file={fileMeta} />}
        </div>
    );
};

export default MediaList;

import { useState, useCallback, useEffect, useRef } from 'react';
import { arraysEqual } from "@helpers/validations.js";

export const useFileModal = (modalId = '', multiple = true, initialValue = [], initialFiles = []) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState(initialValue);
    const [attachments, setAttachments] = useState(initialFiles);
    const [mediaType, setMediaType] = useState('');

    const prevCurrentValue = useRef(initialValue);
    const prevFiles = useRef(initialFiles);

    const openModal = (mediaType = '') => {
        setIsModalOpen(true);
        setMediaType(mediaType);
    };

    const closeModal = () => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            window.HSOverlay.close(modalElement, { removeBackdrop: true });
            setTimeout(() => setIsModalOpen(false), 500);
        }
    };

    useEffect(() => {
        const parentModal = document.querySelector('.parent-modal.open');
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            isModalOpen ? window.HSOverlay.open(modalElement) : window.HSOverlay.close(modalElement);
            if (parentModal) {
                parentModal.classList.toggle('open', isModalOpen);
                modalElement.classList.toggle('open', isModalOpen);
                modalElement.classList.toggle('hidden', !isModalOpen);
            }
        }
    }, [isModalOpen, modalId]);

    useEffect(() => {
        if (!arraysEqual(prevCurrentValue.current, initialValue)) {
            setSelectedIds(initialValue);
            prevCurrentValue.current = initialValue;
        }
    }, [initialValue]);

    useEffect(() => {
        if (!arraysEqual(prevFiles.current, initialFiles)) {
            setAttachments(initialFiles);
            prevFiles.current = initialFiles;
        }
    }, [initialFiles]);

    const handleSelectedFiles = useCallback((selection) => {
        if (multiple) {
            // For multiple files, append new selections
            setSelectedIds((prevIds) => {
                const newIds = selection.ids.filter(id => !prevIds.includes(id));
                return newIds.length ? [...prevIds, ...newIds] : prevIds;
            });
            setAttachments((prevAttachments) => {
                const newAttachments = selection.files.filter(file => !prevAttachments.some(att => att.id === file.id));
                return newAttachments.length ? [...prevAttachments, ...newAttachments] : prevAttachments;
            });
        } else {
            // For single file, replace the existing selection
            setSelectedIds(selection.ids.slice(0, 1));
            setAttachments(selection.files.slice(0, 1));
        }
        closeModal();
    }, [closeModal, multiple]);

    const handleDeleteAttachment = useCallback((id) => {
        setAttachments((prevAttachments) => prevAttachments.filter(attachment => attachment.id !== id));
        setSelectedIds((prevIds) => prevIds.filter(selectedId => selectedId !== id));
    }, []);

    const clearAttachments = useCallback(() => {
        setAttachments([]);
        setSelectedIds([]);
    }, []);

    return {
        isModalOpen,
        openModal,
        closeModal,
        selectedIds,
        attachments,
        handleSelectedFiles,
        handleDeleteAttachment,
        mediaType,
        clearAttachments
    };
};

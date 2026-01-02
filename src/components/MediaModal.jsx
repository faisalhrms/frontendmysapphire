import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import MediaList from "@modules/media/components/MediaList.jsx";

function cleanupHsOverlay() {
    document.querySelectorAll(".hs-overlay-backdrop").forEach((el) => el.remove());
    document.documentElement.classList.remove("hs-overlay-open");
    document.body.classList.remove("hs-overlay-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
}

const MediaModal = React.memo(({ modalId="mediaModal", multiple=false, onClose, selectedFiles, type="" }) => {
    const handleSelectionChange = useCallback((selection) => {
        selectedFiles(selection);
        cleanupHsOverlay();     // ✅ after select
        onClose?.();            // ✅ close modal
    }, [selectedFiles, onClose]);

    const safeClose = useCallback(() => {
        cleanupHsOverlay();
        onClose?.();
    }, [onClose]);

    useEffect(() => {
        cleanupHsOverlay(); // ✅ clear leftovers before showing
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prev || "";
            cleanupHsOverlay();
        };
    }, []);

    return ReactDOM.createPortal(
        <div id={modalId} className="fixed inset-0 z-[99999]">
            <div className="absolute inset-0 bg-black/60" onClick={safeClose} />
            <div className="relative w-full h-full bg-white dark:bg-bodybg">
                <div className="flex justify-end p-3 border-b dark:border-defaultborder/10">
                    <button onClick={safeClose} type="button" className="ti-modal-close-btn">
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>
                <div className="h-[calc(100vh-56px)] overflow-auto">
                    <MediaList
                        type={type}
                        needFileMeta={false}
                        multiSelect={multiple}
                        needSelectedValue={true}
                        onSelectionChange={handleSelectionChange}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
});

export default MediaModal;

import React from "react";
import DataSanitizeService from "@modules/beirholm-bi/services/DataSanitizeService.js";

const DownloadSampleFileButton = () => {
    const handleDownload = async () => {
        try {
            await DataSanitizeService.downloadSampleFile();
        } catch (error) {
            console.error("Download sample file failed", error);
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="ti-btn ti-btn-success"
            title="Download Sample File"
        >
            <i className="ri-download-2-line"></i>
        </button>
    );
};

export default DownloadSampleFileButton;

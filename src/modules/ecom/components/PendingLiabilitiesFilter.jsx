import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import React, {useState} from "react";
import {downloadPendingLiabilitiesReport} from "@modules/ecom/services/ecom_services.js";

const PendingLiabilitiesFilter = ({ control, errors, filters }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadPDF = async () => {
        setIsDownloading(true)
        try {
            const pdfData = await downloadPendingLiabilitiesReport(filters)
            const blob = new Blob([pdfData], { type: "application/pdf" })
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = "Pending Liabilities Report.pdf"
            link.click()
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            {
                                <>
                                    <div className="flex items-center gap-4 flex-1">
                                        <FormInput
                                            type="date"
                                            name="date_from"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 flex-1">
                                        <FormInput
                                            type="date"
                                            name="date_to"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>
                                < />
                            }
                            <FilterButton/>
                            <button
                                type="button"
                                className="ti-btn ti-btn-success !mb-0"
                                onClick={downloadPDF}
                                disabled={isDownloading}
                            >
                                <i className={`bi bi-file-earmark-pdf ${isDownloading ? "animate-spin inline-block" : ""}`}></i>
                                {isDownloading ? "" : ""}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PendingLiabilitiesFilter);
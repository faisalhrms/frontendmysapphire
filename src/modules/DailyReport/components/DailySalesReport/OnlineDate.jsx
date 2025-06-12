import React, {useState} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import {
    downloadDailySaleReport,

} from "@modules/DailyReport/services/wiseside_services.js";

const OnlineDate = ({control, errors, clearFilter, filters , activeTab , expand , setExpand}) => {

    // const today = new Date().toISOString().split('T')[0];
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPDF = async (filters) => {
        try {
            const pdfData = await downloadDailySaleReport(filters);
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'daily_sale_report.pdf';
            link.click();
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }finally {
            setIsDownloading(false)
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
            <div className="box custom-box">
            <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">

                                <FormInput
                                    type="date"
                                    name="date_to"
                                    control={control}
                                    errors={errors}
                                    defaultValue={filters.date_to}
                                    label={true}
                                />
                            </div>
                            {(activeTab === "DailySaleReportList" || activeTab === "DailySales") && (
                                <button
                                    onClick={() => setExpand(!expand)}
                                    type="button"
                                    className="ti-btn ti-btn-primary !mb-0 text-white font-medium text-sm rounded py-2 px-3"
                                >
                                    <i className={expand ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                                    {expand ? "Collapse" : "Expand All"}
                                </button>
                            )}

                            <button
                                type="button"
                                className="ti-btn ti-btn-success !mb-0 text-white font-medium text-sm rounded py-2 px-3"
                                onClick={() => downloadPDF(filters)}
                                disabled={isDownloading}
                            >
                                <i className={`bi bi-file-earmark-pdf ${isDownloading ? "spin" : ""} `}></i>
                                {isDownloading ? "" : ""}
                            </button>
                                <FilterButton/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</>
    );
};

export default React.memo(OnlineDate);

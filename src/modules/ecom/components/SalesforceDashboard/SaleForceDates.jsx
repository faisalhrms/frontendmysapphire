import React, { useState, useEffect } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import {downloadsaleforce} from "@modules/ecom/services/salesforcedashboard_services.js";

const SaleForceDates = ({ control, errors ,activeTab  ,refetch,filters}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        setCurrentDate(formattedDate);
    }, []);
    const downloadPDF = async (filters) => {
        try {
            // setIsDownloading(true)
            const pdfData = await downloadsaleforce (filters);
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Salesforce Dashboard.pdf';
            link.click();
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }finally {
            setIsDownloading(false)
        }
    };
    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                {activeTab === "executiveSummary" ? (
                                            <div className="grid grid-cols-12 gap-6 mb-4">
                                                <div className="col-span-12">
                                                    <div className="box custom-box">
                                                        <div className="box-body p-4">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className="flex-1 flex gap-4">
                                                                    <div className="flex-1">
                                                                    <FormInput
                                                                        type="date"
                                                                        name="date_from"
                                                                        placeholder="From date"
                                                                        control={control}
                                                                        errors={errors}
                                                                        label={true}
                                                                    />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                    <FormInput
                                                                        type="date"
                                                                        name="date_to"
                                                                        placeholder="To date"
                                                                        control={control}
                                                                        errors={errors}
                                                                        label={true}
                                                                    />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 mt-6">
                                                                    <FilterButton/>
                                                                    <button
                                                                        type="button"
                                                                        onClick={refetch}

                                                                        className="hs-dropdown-toggle ti-btn ti-btn-success-full"
                                                                    >
                                                                        <i className="ri-refresh-line inline-block"></i> Refresh
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="ti-btn ti-btn-success !mb-0 text-white font-medium text-sm rounded py-2 px-3"
                                                                        onClick={() => downloadPDF(filters)}
                                                                        disabled={isDownloading}
                                                                    >
                                                                        <i className={`bi bi-file-earmark-pdf ${isDownloading ? "spin" : ""} `}></i>
                                                                        {isDownloading ? "" : ""}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    ) :
                                    <div className="box custom-box p-6">
                                        <div className="text-right  ">

                                            <span className="text-gray-800 font-semibold">As On: </span>
                                            <span className="text-primary font-bold mr-4">{currentDate}</span>
                                            <button
                                                type="button"
                                                onClick={refetch}

                                                className="hs-dropdown-toggle ti-btn ti-btn-success-full"
                                            >
                                                <i className="ri-refresh-line inline-block"></i> Refresh
                                            </button>
                                        </div>
                                    </div>

                                }
                            </div>

                        </div>
            </div>
        </div>
    );
};

export default React.memo(SaleForceDates);

import React, {useState} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";
import { useForm, useWatch } from "react-hook-form";
import {
    downloadDailySaleReport,
    downloadOfflineStorePerformance
} from "@modules/DailyReport/services/wiseside_services.js";

const ComparativeDate = ({ control,errors, clearFilter,filters }) => {


    const [isDownloading, setIsDownloading] = useState(false);



    const downloadPDF = async () => {
        try {
            setIsDownloading(true)
            const pdfData = await downloadOfflineStorePerformance(filters);
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'download/offline-store-performance';
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
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        type="date"
                                        name="startOfMonth"
                                        placeholder="To Cy"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        type="date"
                                        placeholder="From Cy"
                                        name="date"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        type="date"
                                        placeholder="To CL"
                                        name="startOfPrevYear"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="date"
                                            placeholder="From CL"
                                            name="prevYearYesterday"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>
                                    </div>
                                    <FilterButton/>
                                    <FilterClearButton onClick={clearFilter}/>
                                    <button
                                        type="button"
                                        className="ti-btn ti-btn-success !mb-0"
                                        onClick={() => downloadPDF()}
                                        disabled={isDownloading}

                                    >
                                        <i className={`bi bi-file-earmark-pdf ${isDownloading ? "spin" : ""} text-lg`}></i>
                                        {isDownloading ? "" : ""}
                                    </button>

                                </div>
                            </div>
                        </div>
            </div>
        </div>
    );
};

export default React.memo(ComparativeDate);

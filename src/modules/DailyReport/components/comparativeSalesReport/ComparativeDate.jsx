import React, { useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";
import {downloadComparativeSaleReport} from "@modules/DailyReport/services/wiseside_services.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import FormSelect from "@components/form/FormSelect.jsx";

const ComparativeDate = ({
                             control,
                             errors,
                             clearFilter,
                             filters,
                             hideOnlyComparativePeriod = false,
                             showCategoryFilters = false,
                         }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPDF = async () => {
        try {
            setIsDownloading(true);
            const pdfData = await downloadComparativeSaleReport(filters);
            const blob = new Blob([pdfData], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "download/comparative-sales-report";
            link.click();
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="flex-1">
                                    <FormInput
                                        type="date"
                                        placeholder="From Current Period"
                                        name="cy_from"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>
                                <div className="flex-1">
                                    <FormInput
                                        type="date"
                                        name="cy_to"
                                        placeholder="To Current Period"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>
                                {!hideOnlyComparativePeriod && (
                                    <>
                                        <div className="flex-1">
                                            <FormInput
                                                type="date"
                                                placeholder="From Comparative Period"
                                                name="ly_from"
                                                control={control}
                                                errors={errors}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <FormInput
                                                type="date"
                                                placeholder="To Comparative Period"
                                                name="ly_to"
                                                control={control}
                                                errors={errors}
                                            />
                                        </div>
                                    </>
                                )}
                                {
                                    showCategoryFilters &&
                                    <>
                                        <div className="flex-1">
                                            <FormAsyncSelect
                                                name="category"
                                                control={control}
                                                errors={errors}
                                                placeholder="Category"
                                                apiUrl="/reporting/select/categories/"
                                                queryKeyBase="report_categories"
                                                clientSideSearch={true}
                                                preselectedOptions={
                                                    [
                                                        {
                                                            label: filters.category,
                                                            value: filters.category,
                                                        },
                                                    ]}
                                                isClearable={false}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <FormSelect
                                                name="group"
                                                control={control}
                                                errors={errors}
                                                placeholder="Group"
                                                options={[
                                                    {value: "Offline", label: "Offline"},
                                                    {value: "Online", label: "Online"},
                                                ]}
                                                isClearable={false}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <FormSelect
                                                name="sale_type"
                                                control={control}
                                                errors={errors}
                                                placeholder="Sale type"
                                                isClearable={false}
                                                options={[
                                                    {value: "Full Price", label: "Full Price"},
                                                    {value: "Discounted", label: "Discounted"},
                                                ]}
                                            />
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="flex items-center gap-4 mt-6 flex-2">
                                <FilterButton/>
                                <FilterClearButton onClick={clearFilter}/>
                                <button
                                    type="button"
                                    className="ti-btn ti-btn-success !mb-0"
                                    onClick={downloadPDF}
                                    disabled={isDownloading}
                                >
                                    <i
                                        className={`bi bi-file-earmark-pdf ${
                                            isDownloading ? "spin" : ""
                                        } `}
                                    ></i>
                                    {isDownloading ? "" : ""}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ComparativeDate);

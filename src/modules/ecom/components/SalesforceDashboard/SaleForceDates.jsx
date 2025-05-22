import React, { useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";

const SaleForceDates = ({ control, errors, clearFilter, filters ,activeTab , handleSubmit , onSubmit,currentDate}) => {
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };
    const [isDownloading, setIsDownloading] = useState(false);
    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                {activeTab === "executiveSummary" ? (
                                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    ) :
                                    <div className="box custom-box p-6">
                                        <div className="text-right  ">
                                            <span className="text-gray-800 font-semibold">As On: </span>
                                            <span className="text-primary font-bold">{currentDate}</span>
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

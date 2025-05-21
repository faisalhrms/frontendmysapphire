import React from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";

const AnalysisDate = ({
                          activeTab,
                          orderControl,
                          errorControl,
                          orderFilters,
                          errorFilters,
                          handleOrderSubmit,
                          handleErrorSubmit,
                          onOrderSubmit,
                          onErrorSubmit,
                          clearFilter,
                          hideOnlyComparativePeriod,
                      }) => {
    return (
        <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                {activeTab === "orderSource" && (
                                    <form onSubmit={handleOrderSubmit(onOrderSubmit)} className="mb-0">
                                        <div className="bg-white p-3 rounded-lg shadow-md flex items-center space-x-4 dark:text-gray-200 dark:bg-bodybg">
                                            <FormInput
                                                type="date"
                                                name="date_from"
                                                control={orderControl}
                                                defaultValue={orderFilters.date_from}
                                                label={true}
                                            />
                                            <FormInput
                                                type="date"
                                                name="date_to"
                                                control={orderControl}
                                                defaultValue={orderFilters.date_to}
                                                label={true}
                                            />
                                            <FilterButton />
                                        </div>
                                    </form>
                                )}

                                {activeTab === "404error" && (
                                    <form onSubmit={handleErrorSubmit(onErrorSubmit)} className="mb-0">
                                        <div className="bg-white p-3 rounded-lg shadow-md flex items-center space-x-4 dark:text-gray-200 dark:bg-bodybg">
                                            <FormInput
                                                type="date"
                                                name="date_from"
                                                control={errorControl}
                                                defaultValue={errorFilters.date_from}
                                                label={true}
                                            />
                                            <FormInput
                                                type="date"
                                                name="date_to"
                                                control={errorControl}
                                                defaultValue={errorFilters.date_to}
                                                label={true}
                                            />
                                            <FilterButton />
                                        </div>
                                    </form>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-6 flex-2">
                                <FilterClearButton onClick={clearFilter} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AnalysisDate);

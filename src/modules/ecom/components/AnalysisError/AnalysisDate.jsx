import React from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";

const AnalysisDate = ({
                          activeTab,
                          orderControl,
                          errorControl,
                          orderFilters,
    
                          handleOrderSubmit,
                          handleErrorSubmit,
                          onOrderSubmit,
                          onErrorSubmit,

                          getErrorFilters,

                      }) => {
    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">

                                {activeTab === "orderSource" && (
                                    <form onSubmit={handleOrderSubmit(onOrderSubmit)} className="flex items-center justify-between gap-4">

                                            <div className="flex-1">
                                                <FormInput
                                                    type="date"
                                                    name="date_from"
                                                    placeholder="From Date"
                                                    control={orderControl}
                                                    defaultValue={orderFilters.date_from}
                                                    label={true}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <FormInput
                                                    type="date"
                                                    name="date_to"
                                                    placeholder="To Date"
                                                    control={orderControl}
                                                    defaultValue={orderFilters.date_to}
                                                    label={true}
                                                />
                                            </div>
                                        <div className=" mt-6">
                                            <FilterButton/>
                                        </div>

                                    </form>
                                )}

                                {activeTab === "404error" && (
                                    <form onSubmit={handleErrorSubmit(onErrorSubmit)}
                                          className="flex items-center justify-between gap-4">

                                        <div className="flex-1">
                                            <FormInput
                                                type="date"
                                                name="date_from"
                                                placeholder="From Date"
                                                control={errorControl}
                                                defaultValue={getErrorFilters().date_from}
                                                label="From Date"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <FormInput
                                                type="date"
                                                name="date_to"
                                                placeholder="To Date"
                                                control={errorControl}
                                                defaultValue={getErrorFilters().date_to}
                                                label="To Date"
                                            />
                                        </div>
                                        <div className=" mt-6">
                                            <FilterButton/>
                                        </div>


                                    </form>
                                    )}
                            </div>

                        </div>
                    </div>
                </div>


            );
            };

            export default React.memo(AnalysisDate);

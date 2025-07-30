import React from "react";
import PendingLiabilitiesTable from "@modules/ecom/components/PendingLiabilitiesTable.jsx";
import PendingLiabilitiesReturnAgeTable from "@modules/ecom/components/PendingLiabilitiesReturnAgeTable.jsx";

const AgingForPendingLiabilitiesTab = ({ isActive, filters }) => {
    if (!isActive) {
        return null;
    }
    return (
        <>
            <div className="grid grid-cols-12 gap-x-4">
                <div className="xl:col-span-6 col-span-12">
                    <PendingLiabilitiesTable
                        block={1}
                        title="Orders without FO's"
                        filters={filters}
                    />
                </div>
                    <div className="xl:col-span-6 col-span-12">
                        <PendingLiabilitiesTable
                            title="Pending at Warehouse level"
                            filters={filters}
                            block={2}
                        />
                    </div>
            </div>
                <div className="grid grid-cols-12 gap-x-4">
                    <div className="xl:col-span-6 col-span-12">
                        <PendingLiabilitiesTable
                            block={3}
                            title='Pending Liability at Courier'
                            filters={filters}
                        />
                    </div>
                        <div className="xl:col-span-6 col-span-12">
                            <PendingLiabilitiesTable
                                block={4}
                                title='Pending Return at Warehouse'
                                filters={filters}
                            />
                        </div>
                </div>
                    <div className="grid grid-cols-12 gap-x-4">
                        <div className="col-span-12">
                            <PendingLiabilitiesReturnAgeTable
                                filters={filters}
                            />
                        </div>
                    </div>
            </>
            );
            };

            export default AgingForPendingLiabilitiesTab;
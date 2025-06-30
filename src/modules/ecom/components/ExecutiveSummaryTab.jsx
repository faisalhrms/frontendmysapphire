import React from "react";
import ExecutiveSummaryTable from "@modules/ecom/components/ExecutiveSummaryTable.jsx";
import InfoAlert from "../../../InfoAlert.jsx";

const ExecutiveSummaryTab = ({ isActive, filters }) => {
    if (!isActive) {
        return null;
    }
    return (
        <>
            <InfoAlert />
            <div className="grid grid-cols-12 gap-x-4">
                <div className="xl:col-span-6 col-span-12">
                    <ExecutiveSummaryTable
                        type='rco'
                        title='Reconciliation CC vs OMS'
                        filters={filters}
                    />

                    <ExecutiveSummaryTable
                        title="Breakup of Orders into FO's"
                        filters={filters}
                        type='fo'
                    />
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <ExecutiveSummaryTable
                        type='ofs'
                        title='Orders Fulfillment Summary'
                        filters={filters}
                        rows={12}
                    />
                </div>
            </div>
        </>
    );
};

export default ExecutiveSummaryTab;
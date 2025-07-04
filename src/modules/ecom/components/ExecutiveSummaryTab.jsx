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
                        downloadEndpoint='/ecom/pending-liabilities/download/csv/1/'
                        reportName="Reconciliation CC vs OMS/Breakup of Orders into FO's Export Report"
                    />

                    <ExecutiveSummaryTable
                        title="Breakup of Orders into FO's"
                        filters={filters}
                        type='fo'
                        downloadEndpoint='/ecom/pending-liabilities/download/csv/1/'
                        reportName="Reconciliation CC vs OMS/Breakup of Orders into FO's Export Report"
                    />
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <ExecutiveSummaryTable
                        type='ofs'
                        title='Orders Fulfillment Summary '
                        filters={filters}
                        rows={12}
                        downloadEndpoint='/ecom/pending-liabilities/download/csv/3/'
                        reportName="Orders Fulfillment Summary Export Report"
                    />
                </div>
            </div>
        </>
    );
};

export default ExecutiveSummaryTab;
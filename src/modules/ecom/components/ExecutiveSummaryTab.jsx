import React from "react";
import ExecutiveSummaryTable from "@modules/ecom/components/ExecutiveSummaryTable.jsx";

const ExecutiveSummaryTab = ({ isActive, filters }) => {
    if (!isActive) {
        return null;
    }
    return (
        <>
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
                        otherDownloadEndpoint='/ecom/pending-liabilities/download/csv/4/'
                        reportName="Orders Fulfillment Summary Export Report"
                    />
                </div>
            </div>
        </>
    );
};

export default ExecutiveSummaryTab;
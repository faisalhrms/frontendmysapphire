
import React from "react";
import ExecutiveSummaryTable from "@modules/dashboards/sfd/components/ExecutiveSummaryTable.jsx";


const ExecutiveForm = () => {
    const reconciliationHeaders = ["Category", "Count"];
    const reconciliationData = [
        { label: "Commerce Cloud", value: "20,157"},
        { label: "Total - Orders in OMS", value: "20,153" },
        { label: "Missing in OMS", value: "4", },
        { label: "Orders with Single FOs", value: "19,993" },
        { label: "Orders with Multiple FOs", value: "91" },
        { label: "Cancelled in OMS", value: "60" },
        { label: "In-Process with Customer Care (Note-1)", value: "5" },
        { label: "Orders with Exceptions (Note-1)", value: "4" },
        { label: "Total - Orders in OMS", value: "20,153" },
    ];

    const foBreakupHeaders = ["Type", "Count"];
    const foBreakupData = [
        { label: "Single FO's", value: "19,993" },
        { label: "Split-Orders with Multiple FOs", value: "185" },
        { label: "Total FO's to Fulfill", value: "20,178" },
    ];

    const fulfillmentHeaders = ["Status", "Count"];
    const fulfillmentData = [
        { label: "Total Parcels to Fulfill", value: "20,178" },
        { label: "Un-Approved FO's (Note-2)", value: "2" },
        { label: "Approved for Fulfillment (Note-2)", value: "900" },
        { label: "Shipped in OMS but unpicked (Note-3)", value: "593" },
        { label: "In-Transit with Courier (Note-3)", value: "5703" },
        { label: " Delivered to Customers", value: "12,784" },
        { label: " Returns by Courier", value: "196" },
        { label: "Reconciliation", value: "" },
    ];

    return (
        <>
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-2">
                <ExecutiveSummaryTable title="Reconciliation CC vs OMS" headers={reconciliationHeaders}
                                       data={reconciliationData} totals={[]}/>
                <ExecutiveSummaryTable title="Breakup of Orders into FO(Single/Multiple)" headers={foBreakupHeaders}
                                       data={foBreakupData} totals={[]}/>
                <ExecutiveSummaryTable title="Orders Fulfillment Summary" headers={fulfillmentHeaders}
                                       data={fulfillmentData} totals={[]}/>

            </div>


        </>


    );
};

export default ExecutiveForm;

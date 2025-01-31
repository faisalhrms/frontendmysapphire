import React from "react";
import MegaInterTable from "../components/MegaInterTable.jsx"
import MegaSaleTable from "@modules/ecom/components/MegaSaleTable.jsx";
import MegaITransitTable from "@modules/ecom/components/MegaITransitTable.jsx";
import {
    agingData,
    totals,
    megacancelledOrdersData,
    megacancelledOrdersTotals,
    returnPercentageData, returnPercentageTotal
} from "@modules/ecom/components/utils.js";
import MegaCancelledOrdersTable from "@modules/ecom/components/MegaCncellationOrderTable.jsx";
import MegaReturnPercentageTable from "@modules/ecom/components/MegaReturnPercentageTable.jsx";

const PerformanceRatios = () => {

    const internationalHeaders = ["Candela Store", "Total"];


    const internationalData = [
        { store: "E Store", total: 29 },
        { store: "E-Store 4", total: 10 },
        { store: "Estore 2", total: 8 },
    ];


    const totalInternationalData = [
        "Total",
        internationalData.reduce((sum, row) => sum + row.total, 0),
    ];


    const localHeaders = ["Candela Store", "+ 10 Days", "Total"];


    const localData = [
        { store: "E Store", days10: 29, total: 29 },
        { store: "E-Store 4", days10: 10, total: 10 },
        { store: "Estore 2", days10: 8, total: 8 },
    ];


    const totalLocalData = [
        "Total",
        localData.reduce((sum, row) => sum + row.days10, 0),
        localData.reduce((sum, row) => sum + row.total, 0),
    ];


    return (
        <>
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-2">

                <MegaSaleTable title="Local" headers={localHeaders} data={localData} totals={totalLocalData}/>
                <MegaInterTable title="International" headers={internationalHeaders} data={internationalData}
                                totals={totalInternationalData}/>

            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-2">
                <MegaSaleTable title="Local + International"
                               headers={localHeaders}
                               data={localData}
                               totals={totalLocalData}/>
                <MegaITransitTable title="Courier Aging" data={agingData} totals={totals}/>


            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-2">

                <MegaCancelledOrdersTable title="Cancelled Orders" data={megacancelledOrdersData}
                                          totals={megacancelledOrdersTotals}/>
                <MegaReturnPercentageTable title=" Return" data={returnPercentageData}
                                           total={returnPercentageTotal}/>

            </div>
        </>
    );
};

export default PerformanceRatios;

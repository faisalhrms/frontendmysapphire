import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import StaticDataTable from "@modules/DailyReport/components/StaticDataTable/StaticDataTable.jsx";

const CentralReportList = ({data, isLoading, isActive,filters}) => {
    if (!isActive){
        return null
    }
    if (isLoading) {
        return <LoadingSpinner/>;
    }
    return (
        <>
             <StaticDataTable data={data}/>
        </>
    )
}
export default CentralReportList
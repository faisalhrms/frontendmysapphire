import React from 'react';
import CurrentPeriodTable
    from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/CurrentPeriodTable.jsx";
import SummaryTable from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/SummaryTable.jsx";
import CategoryTable from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/Category.jsx";


const AClassFiscal = ({data,isLoading}) => {
    if (isLoading) {
        return null;
    }
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-red' : 'text-emerald-600';
    };

    return (
        <div className="font-sans text-sm">

            <CurrentPeriodTable
                data={data}

            />
            <SummaryTable
               getGrowthColor={getGrowthColor}
                 data={data}
           />
            <CategoryTable
                getGrowthColor={getGrowthColor}
                data={data}
            />

        </div>
    );
};

export default AClassFiscal;

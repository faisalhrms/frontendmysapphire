import React from 'react';
import CurrentPeriodTable
    from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/CurrentPeriodTable.jsx";

import OnlineSalesThree from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlinesaleThree.jsx";
import OnlineSalesTwo from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlineSaleTwo.jsx";


const OnlineSaleList = ({data}) => {
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-danger' : 'text-success';
    };

    return (
        <div className="font-sans text-sm">

            <CurrentPeriodTable
                data={data}
            />
            <OnlineSalesTwo
                getGrowthColor={getGrowthColor}
                data={data}

            />
            <OnlineSalesThree
                getGrowthColor={getGrowthColor}
                data={data}
            />


        </div>
    );
};

export default OnlineSaleList;

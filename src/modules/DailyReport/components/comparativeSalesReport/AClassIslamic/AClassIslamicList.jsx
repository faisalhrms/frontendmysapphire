import React from 'react';
import CurrentPeriodTable
    from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/CurrentPeriodTable.jsx";

import AClassIslamic from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamic.jsx";
import AClassIslamicOnline
    from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamicOnline.jsx";
import IslamicDate from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/IslamicDate.jsx";


const AClassIslamicList = ({data}) => {
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-danger' : 'text-emerald-600';
    };


    return (
        <div className="font-sans text-sm">

            <IslamicDate data={data} />

            <AClassIslamicOnline
                getGrowthColor={getGrowthColor}
                data={data}

            />
            <AClassIslamic
                getGrowthColor={getGrowthColor}
                data={data}
            />


        </div>
    );
};

export default AClassIslamicList ;

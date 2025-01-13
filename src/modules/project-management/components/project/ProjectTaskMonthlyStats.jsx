import React, { useMemo } from "react";

import ApexChart from "@components/charts/ApexChart.jsx";
import {
  mapSeriesToColors,
  statusColorMapping,
} from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ProjectTaskMonthlyStats = ({ months, statsFetching }) => {

  const colors = useMemo(() => {
    return mapSeriesToColors(months?.series, statusColorMapping);
  }, []);

  return (
      <div className="xl:col-span-3 col-span-12">
        <div className="box">
          <div className="box-body !p-0">
            {statsFetching ? (
                <LoadingSpinner />
            ) : (
                <div className="p-6 pb-2">
                  <p className="text-[.9375rem] font-semibold">
                    Tasks Statistics
                    <span className="text-muted font-normal"> (Last 6 months) :</span>
                  </p>
                  <div id="task-list-stats">
                    {colors.length > 0 && (
                        <ApexChart
                            height={610}
                            columnWidth='70%'
                            colors={colors}
                            series={months.series}
                            categories={months.categories}
                        />
                    )}
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ProjectTaskMonthlyStats;

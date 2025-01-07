import { useProjectStatistics } from "@modules/project-management/hooks/projectHooks.js";

import React, { useMemo } from "react";

import ApexChart from "@components/charts/ApexChart.jsx";
import {
  mapSeriesToColors,
  statusColorMapping,
} from "@helpers/statusStyles.js";

const ProjectStatistics = ({ projectId }) => {
  const { data, isLoading, refetch } = useProjectStatistics(projectId);

  const colors = useMemo(() => {
    return mapSeriesToColors(data?.n_months?.series, statusColorMapping);
  }, [data?.n_months?.series]);

  return (
    <div className="xl:col-span-3 col-span-12">
      <div className="box">
        <div className="box-body !p-0">
          <div className="p-6 pb-2">
            <p className="text-[.9375rem] font-semibold">
              Tasks Statistics
              <span className="text-muted font-normal"> (Last 6 months) :</span>
            </p>
            <div id="task-list-stats">
              {colors.length > 0 && (
                <ApexChart
                  colors={colors}
                  series={data.n_months.series}
                  categories={data.n_months.categories}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatistics ;

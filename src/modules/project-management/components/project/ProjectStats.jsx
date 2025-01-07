import {
  useProjectStatistics,
} from "@modules/project-management/hooks/projectHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React, {useMemo} from "react";
import ProjectStatItem from "@modules/project-management/components/project/ProjectStatItem.jsx";
import ApexChart from "@components/charts/ApexChart.jsx";;
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";

const ProjectStats = ({projectId}) => {
  const { data, isLoading, refetch } = useProjectStatistics(projectId);

    const colors = useMemo(() => {
        return mapSeriesToColors(
            data?.n_months?.series,
            statusColorMapping
        );
    }, [data?.n_months?.series]);

  return (
    <div className="xl:col-span-3 col-span-12">
      <div className="box">
        <div className="box-body !p-0">
          {isLoading ? (
              <LoadingSpinner />
          ) : (
              <>
                {
                  data.month_over_month?.map(item => {
                   return <ProjectStatItem item={item} key={item.status} />
                  })
                }
                {/* <div className="p-6 pb-2">
                  <p className="text-[.9375rem] font-semibold">
                    Tasks Statistics
                    <span className="text-muted font-normal"> (Last 6 months) :</span>
                  </p>
                  <div id="task-list-stats">
                      {colors.length > 0 && (
                        <ApexChart colors={colors} series={ data.n_months.series } categories={ data.n_months.categories } />
                      )}
                  </div>
                </div> */}
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;

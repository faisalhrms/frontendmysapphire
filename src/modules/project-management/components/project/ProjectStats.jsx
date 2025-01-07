import {
  useProjectStatistics,
} from "@modules/project-management/hooks/projectHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import ProjectStatItem from "@modules/project-management/components/project/ProjectStatItem.jsx";

const ProjectStats = ({projectId}) => {
  const { data, isLoading, refetch } = useProjectStatistics(projectId);
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
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;

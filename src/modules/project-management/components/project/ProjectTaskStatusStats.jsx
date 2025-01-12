import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import ProjectStatItem from "@modules/project-management/components/project/ProjectStatItem.jsx";

const ProjectTaskStatusStats = ({ monthOverMonth, statsFetching }) => {
  return (
    <div className="xl:col-span-3 col-span-12">
      <div className="box">
        <div className="box-body !p-0">
          {statsFetching ? (
              <LoadingSpinner />
          ) : (
              <>
                {
                    monthOverMonth?.map(item => {
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

export default ProjectTaskStatusStats;

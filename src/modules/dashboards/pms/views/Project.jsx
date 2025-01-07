import React, { useEffect, useMemo, useState } from "react";
import { useProjectStatistics } from "@modules/project-management/hooks/projectHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
// import { Projectdata } from "../views/projectdata.jsx";
import ProjectStatItem from "@modules/project-management/components/project/ProjectStatItem.jsx";
import ApexChart from "@components/charts/ApexChart.jsx";
import {
  mapSeriesToColors,
  statusColorMapping,
} from "@helpers/statusStyles.js";
import { getProjectStatistics } from "../services/services.js";

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const ProjectStats = ({ projectId }) => {
  const { data, isLoading, isError } = useProjectStatistics(projectId);

  const colors = useMemo(() => {
    return mapSeriesToColors(data?.n_months?.series, statusColorMapping);
  }, [data?.n_months?.series]);

  const [graph, setGraph] = useState(null);

  const getGraphData = async () => {
    try {
      const res = await getProjectStatistics();
      setGraph(res);
      console.log(res?.month_over_month);
    } catch (error) {
      console.error("Error fetching project statistics:", error);
    }
  };

  useEffect(() => {
    getGraphData();
  }, []);

  if (isError) {
    return <p className="text-red-500 text-center">Failed to load data.</p>;
  }

  return (
    <>
      <PageHeader
        currentpage={`Project Management`}
        activepage="Poject Management"
        mainpage={"Poject"}
      />
      <div className="grid grid-cols-12 gap-4 max-w-[1250px]">
        <div className="col-span-12 lg:col-span-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            data?.month_over_month?.map((item) => (
              <div className="box" key={item.status}>
                <ProjectStatItem item={item} />
              </div>
            ))
          )}
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="box">
            <div className="box-body ">
              {isLoading ? (
                <LoadingSpinner />
              ) : colors.length > 0 ? (
                <ApexChart
                  height={725}
                  colors={colors}
                  series={data?.n_months?.series}
                  categories={data?.n_months?.categories}
                />
              ) : (
                <p className="text-muted">No data available</p>
              )}
            </div>
          </div>

          {/* <div className="box">
            <div className="box-body py-3 px-1">
              <div id="sessions">
                <Projectdata />
              </div>
            </div>
            <div className="box-footer">
              <div className="grid grid-cols-12 text-center">
                {graph?.month_over_month?.map((label, index) => (
                  <div className="col-span-2 px-0" key={index}>
                    <div className="sm:p-1 whitespace-nowrap">
                      <span className="text-gray-500 text-sm block truncate">
                        {label?.status}
                      </span>
                      <span className="block text-lg font-semibold">
                        {label?.total || "0"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ProjectStats;

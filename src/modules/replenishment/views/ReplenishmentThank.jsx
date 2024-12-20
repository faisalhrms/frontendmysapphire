import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { formatAmountWithCommas } from "@helpers/formatters.js";
import createEventSource from "@config/eventSourceConfig.js";
import ProgressBar from "@modules/replenishment/components/ProgressBar.jsx";

const ReplenishmentThank = () => {
  const location = useLocation();
  const {
    forecast_days,
    message,
    progress,
    status,
    task_id,
    total_items,
    total_warehouses,
    file_url,
  } = location.state || {};

  const [reportProgress, setReportProgress] = useState(progress);
  const [msg, setMsg] = useState(message);
  const [reportStatus, setReportStatus] = useState(status);
  const [reportFileName, setReportFileName] = useState('Replenishment_Report.zip');
  const [reportFileUrl, setReportFileUrl] = useState(file_url);

  useEffect(() => {
    if (!task_id) return;
    const eventSource = createEventSource(`/scm/report/progress/${task_id}`);

    eventSource.onmessage = function (event) {
      const progressData = JSON.parse(event.data);
      console.log("Report Progress:", progressData);
      setReportProgress(progressData.progress);
      setMsg(progressData.message);
      setReportStatus(progressData.status);
      setReportFileUrl(progressData.file_url);
      setReportFileName(progressData.file_name);
    };

    // Handling error during SSE connection
    eventSource.onerror = function (error) {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [task_id]);

  const handleDownload = () => {
    if (reportFileUrl) {
      const link = document.createElement("a");
      link.href = reportFileUrl;
      link.download = reportFileName;
      link.click();
    } else {
      alert("Report URL is not available yet.");
    }
  };

  return (
      <>
        <div className="col-span-12">
          <div className="authentication-page md:h-full sm:py-16 w-full flex items-center justify-center">
            <main id="content" className="w-full lg:max-w-[37rem] p-6">
              <div className="mt-7 text-center">
                <h1 className="font-bold mb-2 text-6xl dark:text-defaulttextcolor/70 text-primary">
                  Thank you!
                </h1>
                <p className="mb-4 font-bold text-xl text-gray-500 ">{msg}</p>
                {reportStatus === "completed" && reportFileUrl !== "" ? (
                    <button
                        type="button"
                        className="ti-btn ti-btn-primary-full m-2"
                        onClick={handleDownload}
                    >
                      <i className="ri-file-download-line text-[1rem]"></i>
                      <span className="me-2">Download Report</span>
                    </button>
                ) : (
                    <ProgressBar progress={reportProgress} />
                )}
              </div>
              <div>
                <div className="flex justify-center space-x-8 p-4 items-center mt-3">
                  <div
                      className="flex-none w-48 h-48 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-white text-center overflow-hidden">
                    <p className="mb-2 font-bold text-xl  text-gray-500 whitespace-nowrap text-center">
                      Forecast Days
                    </p>
                    <h4 className="text-6xl font-bold text-gray-800">{forecast_days}</h4>
                  </div>

                  <div className="flex-none w-[400px] h-48 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-white text-center overflow-hidden">
                    <p className="mb-2  text-xl font-bold  text-gray-500 whitespace-nowrap">
                      Total SKUS
                    </p>
                    <h4 className="text-5xl p-4 font-bold overflow-hidden text-ellipsis text-gray-800">
                      {formatAmountWithCommas(total_items)}
                    </h4>
                  </div>

                  <div className="flex-none w-48 h-48 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-white text-center overflow-hidden">
                    <p className="mb-2 text-xl font-bold text-gray-500 whitespace-nowrap ">
                      No of stores
                    </p>
                    <h4 className="text-6xl font-bold text-gray-800">{total_warehouses}</h4>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
  );
};

export default ReplenishmentThank;

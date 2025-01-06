import {  useState } from "react";

import { TransactionProject } from "./TransactionProject";
import CountUp from "react-countup";

const ProjectDashboard = () => {
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date) => {
    if (date) {
      setStartDate(date);
    }
  };
  const [startDate1, setStartDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    if (date) {
      setStartDate1(date);
    }
  };

  return (
    <div className="xl:col-span-3 col-span-12">
      <div className="box">
        <div className="box-body !p-0">
          <div className="!p-6 border-b dark:border-defaultborder/10 border-dashed flex items-start">
            <div className="svg-icon-background bg-primary/10 me-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                data-name="Layer 1"
                viewBox="0 0 24 24"
                className="svg-primary"
              >
                <path d="M13,16H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM9,10h2a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,2H18V3a1,1,0,0,0-.5-.87,1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0A1,1,0,0,0,2,3V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM5,20a1,1,0,0,1-1-1V4.73L6,5.87a1.08,1.08,0,0,0,1,0l3-1.72,3,1.72a1.08,1.08,0,0,0,1,0l2-1.14V19a3,3,0,0,0,.18,1Zm15-1a1,1,0,0,1-2,0V14h2Zm-7-7H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z" />
              </svg>
            </div>
            <div className="flex-grow">
              <h6 className="!mb-1 text-[0.75rem]">
                New Tasks
                <span className="badge bg-primary text-white font-semibold ltr:float-right rtl:float-left">
                  12,345
                </span>
              </h6>
              <div className="pb-0 mt-0">
                <div>
                  <h4 className="text-[1.125rem] font-semibold mb-1">
                    <CountUp className="count-up" end={42} />
                    <span className="text-muted ltr:float-right rtl:float-left text-[.6875rem] font-normal">
                      Last Year
                    </span>
                  </h4>
                  <p className="text-muted text-[.6875rem] mb-0 leading-none">
                    <span className="text-success me-1 font-semibold">
                      <i className="ri-arrow-up-s-line me-1 align-middle"></i>
                      3.25%
                    </span>
                    <span>this month</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-b dark:border-defaultborder/10 border-dashed flex items-start">
            <div className="svg-icon-background bg-success/10 !fill-success me-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="svg-success"
              >
                <path d="M11.5,20h-6a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h5V7a3,3,0,0,0,3,3h3v5a1,1,0,0,0,2,0V9s0,0,0-.06a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.29.29,0,0,0-.1,0A1.1,1.1,0,0,0,11.56,2H5.5a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3h6a1,1,0,0,0,0-2Zm1-14.59L15.09,8H13.5a1,1,0,0,1-1-1ZM7.5,14h6a1,1,0,0,0,0-2h-6a1,1,0,0,0,0,2Zm4,2h-4a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Zm-4-6h1a1,1,0,0,0,0-2h-1a1,1,0,0,0,0,2Zm13.71,6.29a1,1,0,0,0-1.42,0l-3.29,3.3-1.29-1.3a1,1,0,0,0-1.42,1.42l2,2a1,1,0,0,0,1.42,0l4-4A1,1,0,0,0,21.21,16.29Z" />
              </svg>
            </div>
            <div className="flex-grow">
              <h6 className="mb-1 text-[0.75rem]">
                Completed Tasks
                <span className="badge bg-success text-white font-semibold ltr:float-right rtl:float-left">
                  4,176
                </span>
              </h6>
              <div>
                <h4 className="text-[1.125rem] font-semibold mb-1">
                  <CountUp className="count-up" end={320} />
                  <span className="text-muted ltr:float-right rtl:float-left text-[.6875rem] font-normal">
                    Last Year
                  </span>
                </h4>
                <p className="text-muted text-[.6875rem] mb-0 leading-none">
                  <span className="text-danger me-1 font-semibold">
                    <i className="ri-arrow-down-s-line me-1 align-middle"></i>
                    1.16%
                  </span>
                  <span>this month</span>
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border-b dark:border-defaultborder/10 border-dashed flex items-start">
            <div className="svg-icon-background bg-warning/10 me-4 !fill-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                viewBox="0 0 24 24"
                className="svg-warning"
              >
                <path d="M19,12h-7V5c0-0.6-0.4-1-1-1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9C20,12.4,19.6,12,19,12z M12,19.9c-3.8,0.6-7.4-2.1-7.9-5.9C3.5,10.2,6.2,6.6,10,6.1V13c0,0.6,0.4,1,1,1h6.9C17.5,17.1,15.1,19.5,12,19.9z M15,2c-0.6,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1C22,5.1,18.9,2,15,2z M16,8V4.1C18,4.5,19.5,6,19.9,8H16z" />
              </svg>
            </div>
            <div className="flex-grow">
              <h6 className="mb-1 text-[0.75rem]">
                Pending Tasks
                <span className="badge bg-warning text-white font-semibold ltr:float-right rtl:float-left">
                  7,064
                </span>
              </h6>
              <div>
                <h4 className="text-[1.125rem] font-semibold mb-1">
                  <CountUp className="count-up" end={82} />
                  <span className="text-muted ltr:float-right rtl:float-left text-[.6875rem] font-normal">
                    Last Year
                  </span>
                </h4>
                <p className="text-muted text-[.6875rem] mb-0 leading-none">
                  <span className="text-success me-1 font-semibold">
                    <i className="ri-arrow-up-s-line me-1 align-middle"></i>
                    0.25%
                  </span>
                  <span>this month</span>
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border-b dark:border-defaultborder/10 border-dashed flex items-start">
            <div className="svg-icon-background bg-secondary/10 text-secondary !fill-secondary me-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                viewBox="0 0 24 24"
                className="svg-secondary"
              >
                <path d="M19,12h-7V5c0-0.6-0.4-1-1-1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9C20,12.4,19.6,12,19,12z M12,19.9c-3.8,0.6-7.4-2.1-7.9-5.9C3.5,10.2,6.2,6.6,10,6.1V13c0,0.6,0.4,1,1,1h6.9C17.5,17.1,15.1,19.5,12,19.9z M15,2c-0.6,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1C22,5.1,18.9,2,15,2z M16,8V4.1C18,4.5,19.5,6,19.9,8H16z" />
              </svg>
            </div>
            <div className="flex-grow">
              <h6 className="mb-1 text-[0.75rem]">
                Inprogress Tasks
                <span className="badge bg-secondary text-white font-semibold ltr:float-right rtl:float-left">
                  1,105
                </span>
              </h6>
              <div>
                <h4 className="text-[1.125rem] font-semibold mb-1">
                  <CountUp className="count-up" end={33} />
                  <span className="text-muted ltr:float-right rtl:float-left text-[.6875rem] font-normal">
                    Last Year
                  </span>
                </h4>
                <p className="text-muted text-[.6875rem] mb-0 leading-none">
                  <span className="text-success me-1 font-semibFold">
                    <i className="ri-arrow-down-s-line me-1 align-middle"></i>
                    0.46%
                  </span>
                  <span>this month</span>
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 pb-2">
            <p className="text-[.9375rem] font-semibold">
              Tasks Statistics
              <span className="text-muted font-normal">(Last 6 months) :</span>
            </p>
            <div id="task-list-stats">
              <TransactionProject />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;

import { Fragment, useState } from "react";

import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import CreatedAssign from "./components/CreatedAssign";
import TaskCompleteLeft from "./components/TaskCompleteLeft";
import TaskCompleteForm from './components/TaskCompleteRight';
import { Link } from "react-router-dom";


function TaskGeneratedForm() {
  const Selectdata = [
    { value: "Angelina May", label: "Angelina May" },
    { value: "Kiara advain", label: "Kiara advain" },
    { value: "Hercules Jhon", label: "Hercules Jhon" },
    { value: "Mayor Kim", label: "Mayor Kim" },
  ];
  const Option1 = [
    { value: "New", label: "New" },
    { value: "Completed", label: "Completed" },
    { value: "Inprogress", label: "Inprogress" },
    
    { value: "Pending", label: "Pending" },
  ];
  const Option2 = [
    { value: "High", label: "High" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
  ];

  const IconButton = ({ icon, onClick }) => (
    <button
      className="flex justify-center items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      <i className={`fas ${icon}`}></i>
    </button>
  );

  const TaskFormHeader = ({ title }) => (
    <div className="flex justify-between bg-white  dark:bg-bodybg  items-center border-b border-gray-200 bg-blue-50 p-2">
      <div className="flex space-x-2">
        <div className="justify-between flex">
          <button
            type="button"
            className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            data-hs-overlay="#create-task"
          >
            <i className="ri-add-line font-semibold align-middle"></i> Create
            Task
          </button>
          <div id="create-task" className="hs-overlay hidden ti-modal">
            <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
              <div className="ti-modal-content">
                <div className="ti-modal-header">
                  <h6 className="modal-title" id="staticBackdropLabel2">
                    Add Task
                  </h6>
                  <button
                    type="button"
                    className="hs-dropdown-toggle ti-modal-close-btn"
                    data-hs-overlay="#create-task"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-3.5 h-3.5"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.489"></path>
                    </svg>
                  </button>
                </div>
                <div className="ti-modal-body">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="xl:col-span-6 col-span-12">
                      <label htmlFor="task-name" className="form-label">
                        Task Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="task-name"
                        placeholder="Task Name"
                      />
                    </div>
                    <div className="xl:col-span-6 col-span-12">
                      <label htmlFor="task-id" className="form-label">
                        Task ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="task-id"
                        placeholder="Task ID"
                      />
                    </div>

                    <div className="xl:col-span-6 col-span-12">
                      <label className="form-label">Status</label>
                      <Select
                        id="choices-single-default1"
                        name="colors"
                        options={Option1}
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                        defaultValue={[Option1[0]]}
                      />
                    </div>
                    <div className="xl:col-span-6 col-span-12">
                      <label className="form-label">Priority</label>
                      <Select
                        id="choices-single-default1"
                        name="colors"
                        options={Option2}
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                        defaultValue={[Option2[0]]}
                      />
                    </div>
                    <div className="xl:col-span-12 col-span-12">
                      <label className="form-label">Assigned To</label>
                      <Select
                        isMulti
                        id="choices-multiple-remove-button1"
                        name="choices-multiple-remove-button1"
                        options={Selectdata}
                        className="!p-0 form-control"
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                      />
                    </div>
                  </div>
                </div>
                <div className="ti-modal-footer">
                  <button
                    type="button"
                    className="hs-dropdown-toggle ti-btn ti-btn-light"
                    data-hs-overlay="#create-task"
                  >
                    Cancel
                  </button>
                  <Link className="ti-btn ti-btn-primary-full" to="#">
                    Add Task
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <button className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
            <i className="bi bi-link-45deg font-semibold align-middle"></i> Link
            Task
          </button>
        </div>
      </div>
      <div>
  <div className="grid grid-cols-12 gap-2 w-full p-2">
    <Select
      name="colors"
      options={Option1}
      className="col-span-4 text-gray-600 focus:outline-none"
      menuPlacement="auto"
      classNamePrefix="Select2"
    />
    
   
    <div className="col-span-3 flex justify-center items-center">
      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div className="bg-blue-600 ti-btn-primary-full h-1.5 rounded-full w-1/5" />
      </div>
    </div>

    <Select
      name="colors"
      options={Option1}
      className="col-span-4 text-gray-600 focus:outline-none"
      menuPlacement="auto"
      classNamePrefix="Select2"
    />
    <button className="col-span-1 bi bi-cloud-arrow-up ti-btn ti-btn-primary-full" />
  </div>
</div>
    </div>
  );

  return (
    <div className="dark:bg-bodybg p-4 rounded-lg my-6">
      <TaskFormHeader />
      <CreatedAssign />
      <div className="flex flex-col lg:flex-row lg:space-x-4 w-full mt-8">
        <TaskCompleteLeft type="first" />
       <TaskCompleteForm type='first'/>
     
      </div>
    </div>
  );
}

export default TaskGeneratedForm;

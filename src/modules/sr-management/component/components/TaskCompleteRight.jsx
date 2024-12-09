import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import Rating from "@mui/material/Rating";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

function ContentRight({ type }) {
 
  const [ratingValue2, setRatingValue2] = useState(null);
  const handleRatingChange2 = (_event, newValue) => {
    setRatingValue2(newValue);
 
  };
  return (
    <div className="w-full lg:w-2/5  rounded-lg  mt-4 lg:mt-0 dark:bg-bodybg">
       

      <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Rating & Remarks
          </h2>
        </div>
         <div className="xxl:col-span-4 xl:col-span-6 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="flex flex-wrap items-center justify-between">
                <div id="rater-steps">
                  <Rating
                    name="clickable-rating"
                    value={ratingValue2}
                    onChange={handleRatingChange2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Team
          </h2>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-gray-500 rounded-full inline-block"></span>
              <span className="text-gray-800 dark:text-gray-200">
                Umer Irfan
              </span>
            </div>
            <button className="focus:outline-none">
              <i className="bi bi-trash3-fill bg-text h-4 w-4" />
            </button>
          </div>
     
          <button 
          
          className="w-full lg:w-auto bg-purple text-white py-2 lg:py-1 px-4 rounded-sm ti-btn ti-btn-primary-full focus:outline-none"
   
          >
            Manage
          </button>
        
        </div>
      </div>
  
      <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Attachments
          </h2>
        </div>

        <div className="p-4 space-y-4">
          <button className="flex items-center justify-center bg-success text-white p-2 rounded-md w-10 h-10 hover:bg-success-600 focus:outline-none">
            <PlusIcon className="h-6 w-6" />
          </button>

          <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <span className="text-gray-800 dark:text-gray-400">
              image001.png
            </span>
            <button className="text-gray-500 dark:text-gray-200 hover:text-gray-700 focus:outline-none">
              <i className=" ri-eye-line h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Sub Tasks
          </h2>
        </div>

        <div className="p-2 overflow-x-auto rounded-md">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            No subtasks available.
          </h2>
        </div>
      </div>

      <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Approvals
          </h2>
        </div>

        <div className="p-4 text-center text-gray-600">
          No approvals found for this ticket.
        </div>

        <div className="p-4">
          <button className="flex items-center text-white py-1 px-3 rounded-md ti-btn ti-btn-primary-full focus:outline-none">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentRight;

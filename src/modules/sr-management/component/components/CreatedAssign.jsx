import React from "react";

function CreatedAssign({ generatedReqData, serviceRequest }) {
  return (
    <div className="relative bg-white lg:max-w-[100%] lg:max-h-[100%] px-4 py-4 dark:bg-bodybg mt-6 rounded-md shadow-md">
      <div className="flex justify-start items-center w-full space-x-8">
        <div className="text-center">
          <p className="ri-checkbox-circle-fill text-primary mx-auto" />
          <p className="text-primary font-medium mt-2">Created</p>
          <p className="text-gray-500 text-sm">
            {serviceRequest?.created_at
              ? new Date(serviceRequest?.created_at).toLocaleString()
              : "No Date"}
          </p>
        </div>

        <span className="text-info bi bi-arrow-right text-2xl"></span>

        <div className="text-center">
          <p className="ri-refresh-line text-info mx-auto" />
          <p className="text-info font-medium mt-2">Assigned</p>
          <p className="text-gray-500 text-sm">
            {generatedReqData?.created_at
              ? new Date(generatedReqData?.created_at).toLocaleString()
              : "No Date"}
          </p>
        </div>

        {serviceRequest?.completed_at && (
          <>
            <span className="text-warning bi bi-arrow-right text-2xl"></span>
            <div className="text-center">
              <p className="ri-check-double-line text-warning mx-auto" />
              <p className="text-warning font-medium mt-2">Completed</p>
              <p className="text-gray-500 text-sm">
                {new Date(serviceRequest?.completed_at).toLocaleString()}
              </p>
            </div>
          </>
        )}

        {serviceRequest?.closed_at && (
          <>
            <span className="text-success bi bi-arrow-right text-2xl"></span>
            <div className="text-center">
              <p className="ri-mail-close-line text-success mx-auto" />
              <p className="text-success font-medium mt-2">Closed</p>
              <p className="text-gray-500 text-sm">
                {new Date(serviceRequest?.closed_at).toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreatedAssign;

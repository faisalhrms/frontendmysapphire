import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import { useForm } from "react-hook-form";
import Discussion from "@components/Discussion.jsx";
import SRDiscussion from "@modules/sr-management/component/SRDiscussion.jsx";
import ModelRight from "@components/ModalRight.jsx";

function ContentLeft({ generatedReqData, serviceRequest, selectedStatus }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      description: serviceRequest.description || "",
    },
  });

  console.log(generatedReqData);

  return (
    <div className="w-full lg:w-3/5  rounded-lg dark:bg-bodybg">
      <ModelRight isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className="box shadow-md  dark:border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Service Request Info
          </h2>
        </div>

        <div className="p-4">
          <table className="w-full text-sm text-gray-600">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  Sr #
                </td>
                <td className="py-3 text-gray-700  text-normal dark:text-gray-200">
                  {serviceRequest.sr_number}
                </td>
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  Created At:
                </td>
                <td className="py-3 text-gray-700 text-normal dark:text-gray-400">
                  {serviceRequest.created_at
                    ? new Date(serviceRequest.created_at).toLocaleString()
                    : "No Date"}
                </td>
              </tr>

              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  Need By Date:
                </td>
                <td className="py-3 text-gray-700 text-normal dark:text-gray-200">
                  {serviceRequest.need_by_date
                    ? new Date(serviceRequest.need_by_date).toLocaleDateString()
                    : "No Need By Date"}
                </td>
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  Created By:
                </td>
                <td className="py-3 text-gray-700 ext-normal dark:text-gray-400">
                  {serviceRequest.reporter}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  Status:
                </td>
                <td className="py-3 text-gray-700 ext-normal dark:text-gray-200">
                  <span className="badge bg-primary/10 text-primary">
                    {selectedStatus?.label
                      ? selectedStatus?.label
                      : serviceRequest?.status || "-"}
                  </span>
                </td>
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  Progress:
                </td>
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  <div className="w-48 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 ti-btn-primary-full h-1.5 rounded-full"
                      style={{ width: `${generatedReqData?.progress}%` }}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  CC Employee:
                </td>
                <td className="py-3 text-gray-700 ext-normal dark:text-gray-200">
                  {serviceRequest.cc_email_names || "-"}{" "}
                </td>
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  On Behalf Of:
                </td>
                <td className="py-3 text-gray-700 ext-normal dark:text-gray-200">
                  {" "}
                  {serviceRequest.on_behalf_of
                    ? serviceRequest.on_behalf_employee
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="box shadow-md dark:border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50 ">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Description
          </h2>
        </div>

        <div className="p-4 pt-2">
          <table className="w-full text-sm text-gray-600">
            <tbody>
              <tr>
                <td className="py-2 text-gray-700 text-normal dark:text-gray-200">
                  <FormRichTextarea
                    name=""
                    control={control}
                    errors={errors}
                    readOnly
                    placeholder=""
                    editorOptions={{
                      height: 300,
                      buttonList: [],
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {generatedReqData && Object.keys(generatedReqData).length > 0 && (
        <div className="box shadow-md dark:border dark:border-gray-700 rounded-lg overflow-hidden">
          <SRDiscussion
            title="Task Discussions"
            getEndPoint={`/sr-task/${serviceRequest.id}/discussions/`}
            serviceRequest={serviceRequest}
          />
        </div>
      )}
    </div>
  );
}

export default ContentLeft;

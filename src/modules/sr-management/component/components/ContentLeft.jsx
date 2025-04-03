import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import { useForm } from "react-hook-form";
import Discussion from "@components/Discussion.jsx";
import SRDiscussion from "@modules/sr-management/component/SRDiscussion.jsx";
import ModelRight from "@components/ModalRight.jsx";
import { getBadgeClasses } from "@helpers/badges.js";
import { toTitleCase } from "@helpers/formatters.js";
import Tooltip from "@components/Tooltip.jsx";
import useFullScreen from "@hooks/useFullScreen.js";

function ContentLeft({ generatedReqData, serviceRequest, selectedStatus }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const processEmailContent = (html, attachments) => {
    if (!html || !attachments) return html;
    let updatedHtml = html;
    attachments.forEach((att) => {
      if (att.cid && att.file) {
        const regex = new RegExp(`cid:${att.cid}`, "g");
        updatedHtml = updatedHtml.replace(regex, att.file);
      }
    });
    return updatedHtml;
  };

  const processedDescription = useMemo(() => {
    return processEmailContent(
      serviceRequest.description,
      serviceRequest.attachments
    );
  }, [serviceRequest.description, serviceRequest.attachments]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      description: processedDescription || "",
    },
  });

  const getSlaBadgeClasses = (slaHours) => {
    if (slaHours >= 48) {
      return "bg-green-500/10 text-green-500 px-2 py-1 rounded-md";
    } else if (slaHours >= 24) {
      return "bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md";
    } else if (slaHours > 0) {
      return "bg-red-500/10 text-red-500 px-2 py-1 rounded-md";
    }
    return "bg-gray-500/10 text-gray-500 px-2 py-1 rounded-md";
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const { isFullscreen, handleFullscreenClick } = useFullScreen();
  const containerHeight = isFullscreen ? "calc(100vh - 100px)" : "500px";

  return (
    <div className="w-full lg:w-4/5 rounded-lg dark:bg-bodybg overflow-hidden">
      <ModelRight isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className="box shadow-md dark:border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Service Request Info
          </h2>
        </div>
        <div className="box-body">
          <div className="font-semibold mb-4 task-title text-[0.8rem]">
            <Tooltip
              id={`request-tooltip-${serviceRequest.id}`}
              text={serviceRequest.request_title}
              tooltipContent={serviceRequest.request_title}
            >
              <p>
                {serviceRequest.request_title.length > 100
                  ? `${serviceRequest.request_title.slice(0, 100)}...`
                  : serviceRequest.request_title}
              </p>
            </Tooltip>
          </div>
          <div className="table-responsive">
            <table className="table whitespace-nowrap min-w-full">
              <tbody>
                <tr className="border-b border-defaultborder">
                  <td className="font-semibold">Sr #</td>
                  <td>{serviceRequest.sr_number}</td>
                  <td className="font-semibold">Created At:</td>
                  <td>
                    {serviceRequest.created_at
                      ? new Date(serviceRequest.created_at).toLocaleString()
                      : "No Date"}
                  </td>
                </tr>
                <tr className="border-b border-defaultborder">
                  <td className="font-semibold">Need By Date:</td>
                  <td>
                    {serviceRequest.need_by_date
                      ? new Date(serviceRequest.need_by_date).toLocaleDateString()
                      : "No Need By Date"}
                  </td>
                  <td>Created By:</td>
                  <td>{serviceRequest.reporter}</td>
                </tr>
                <tr className="border-b border-defaultborder">
                  <td>Status:</td>
                  <td>
                    <span className="badge bg-primary/10 text-primary">
                      {selectedStatus?.label
                        ? selectedStatus?.label
                        : generatedReqData?.status || "-"}
                    </span>
                  </td>
                  <td>Progress:</td>
                  <td>
                    <div className="w-48 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 ti-btn-primary-full h-1.5 rounded-full"
                        style={{ width: `${generatedReqData?.progress}%` }}
                      />
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-defaultborder">
                  <td>Priority:</td>
                  <td>
                    {generatedReqData?.priority ? (
                      <span className={getBadgeClasses(generatedReqData.priority)}>
                        {toTitleCase(generatedReqData.priority)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td>SLA Hours:</td>
                  <td>
                    {generatedReqData?.sla_hours ? (
                      <span className={getSlaBadgeClasses(generatedReqData.sla_hours)}>
                        {generatedReqData.sla_hours} : Hours
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-defaultborder">
                  <td>CC Employee:</td>
                  <td className="space-x-1 rtl:space-x-reverse">
                    {serviceRequest.cc_email_names ? (
                      <div>
                        {chunkArray(
                          serviceRequest.cc_email_names.split(","),
                          2
                        ).map((chunk, chunkIndex) => (
                          <div key={chunkIndex} className="flex gap-2 mb-1">
                            {chunk.map((email, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200"
                              >
                                {email.trim()}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-defaultborder">
                  <td>On Behalf Of:</td>
                  <td>
                    {serviceRequest.on_behalf_of
                      ? serviceRequest.on_behalf_employee
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={`box ${isFullscreen ? "box-fullscreen" : ""}`}>
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Description
          </h2>
          <Link
            aria-label="anchor"
            to="#"
            className="flex items-center justify-center w-[1.75rem] h-[1.75rem] !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium terms-fullscreen"
            onClick={handleFullscreenClick}
          >
            <i className="ri-fullscreen-line"></i>
          </Link>
        </div>
        <div className="p-3 pt-2">
          <div className="box shadow-md dark:border dark:border-gray-700 rounded-lg overflow-hidden">
            <FormRichTextarea
              name="description"
              control={control}
              errors={errors}
              readOnly
              editorOptions={{
                height: 400,
                buttonList: [],
              }}
            />
          </div>
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

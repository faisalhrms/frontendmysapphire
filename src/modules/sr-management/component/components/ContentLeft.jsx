import React, {useState} from "react";
import {Link} from "react-router-dom";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import {useForm} from "react-hook-form";
import Discussion from "@components/Discussion.jsx";
import SRDiscussion from "@modules/sr-management/component/SRDiscussion.jsx";
import ModelRight from "@components/ModalRight.jsx";
import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";

function ContentLeft({generatedReqData, serviceRequest, selectedStatus}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {
            description: serviceRequest.description || "",
        },
    });
const getSlaBadgeClasses = (slaHours) => {

    if (slaHours >= 48) {
        return "bg-green-500/10 text-green-500 px-2 py-1 rounded-md"; // Low SLA
    } else if (slaHours >= 24) {
        return "bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md"; // Medium SLA
    } else if (slaHours > 0) {
        return "bg-red-500/10 text-red-500 px-2 py-1 rounded-md"; // High SLA
    }
    return "bg-gray-500/10 text-gray-500 px-2 py-1 rounded-md"; // Default case
};

const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};



    return (
        <div className="w-full lg:w-4/5  rounded-lg dark:bg-bodybg">
            <ModelRight isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
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
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                Sr #
                            </td>
                            <td className="py-3 text-gray-700  text-normal dark:text-gray-200 text-xs">
                                {serviceRequest.sr_number}
                            </td>
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                Created At:
                            </td>
                            <td className="py-3 text-gray-700 text-normal dark:text-gray-400 text-xs">
                                {serviceRequest.created_at
                                    ? new Date(serviceRequest.created_at).toLocaleString()
                                    : "No Date"}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-200">
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                Need By Date:
                            </td>
                            <td className="py-3 text-gray-700 text-normal dark:text-gray-200 text-xs">
                                {serviceRequest.need_by_date
                                    ? new Date(serviceRequest.need_by_date).toLocaleDateString()
                                    : "No Need By Date"}
                            </td>
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                Created By:
                            </td>
                            <td className="py-3 text-gray-700 ext-normal dark:text-gray-400 text-xs">
                                {serviceRequest.reporter}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                Status:
                            </td>
                            <td className="py-3 text-gray-700 ext-normal dark:text-gray-200 text-xs">
                  <span className="badge bg-primary/10 text-primary">
                    {selectedStatus?.label
                        ? selectedStatus?.label
                        : generatedReqData?.status || "-"}
                  </span>
                            </td>
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                Progress:
                            </td>
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                                <div className="w-48 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 ti-btn-primary-full h-1.5 rounded-full"
                                        style={{width: `${generatedReqData?.progress}%`}}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                Priority:
                            </td>
                            <td className="py-3 text-gray-700 text-normal dark:text-gray-200 text-xs">
                                {generatedReqData?.priority ? (
                                    <span className={getBadgeClasses(generatedReqData.priority)}>
                                 {toTitleCase(generatedReqData.priority)}
                                  </span>
                                ) : (
                                    <span className="text-gray-500">-</span>
                                )}
                            </td>


                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                SLA Hours:
                            </td>
                            <td className="py-3 text-gray-700 text-normal dark:text-gray-200 text-xs">
                                {generatedReqData?.sla_hours ? (
                                    <span className={getSlaBadgeClasses(generatedReqData.sla_hours)}>
                                 {(generatedReqData.sla_hours)} : Hours
                                  </span>
                                ) : (
                                    <span className="text-gray-500">-</span>
                                )}
                            </td>


                        </tr>
                        <tr>
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                CC Employee:
                            </td>
                            <td className="py-3 text-gray-700 text-normal dark:text-gray-200">
                                {serviceRequest.cc_email_names ? (
                                    <div>
                                        {chunkArray(serviceRequest.cc_email_names.split(","), 3).map((chunk, chunkIndex) => (
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


                        <tr>
                            <td className="py-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                On Behalf Of:
                            </td>
                            <td className="py-3 text-gray-700 ext-normal dark:text-gray-200 text-xs">
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
                                    name="description"
                                    control={control}
                                    errors={errors}
                                    readOnly
                                    editorOptions={{
                                        height: 300,
                                        buttonList: []
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

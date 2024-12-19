import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Rating from "@mui/material/Rating";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

import {formatOptions} from "@helpers/formatters.js";
import SubTaskList from "@modules/sr-management/component/components/SubTaskList.jsx";
import SRAttachment from "@modules/sr-management/component/SRAttachment.jsx";

const ContentRight = ({projectData = {}, isEditMode = false, generatedReqData, serviceRequest}) => {
    const [ratingValue2, setRatingValue2] = useState(null);

    const {control, handleSubmit, formState: {errors, isSubmitting}, setValue} = useForm({});


    useEffect(() => {
        if (generatedReqData) {
            Object.keys(generatedReqData).forEach(key => {
                setValue(key, generatedReqData[key]);
            });
        }
    }, [generatedReqData, setValue]);

    const userOptions = formatOptions(generatedReqData, 'users', 'id', 'full_name');

    return (
        <form
            className="w-full lg:w-2/5 rounded-lg mt-4 lg:mt-0 dark:bg-bodybg"
        >
            <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
                    <h2 className="box-title text-lg font-semibold text-gray-700">
                        Rating & Remarks
                    </h2>
                </div>
                <div className="xxl:col-span-4 xl:col-span-6 col-span-12">
                    <div className="box custom-box">
                        <div className="box-body">
                            <Rating
                                name="clickable-rating"
                                value={generatedReqData?.progress}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
                    <h2 className="box-title text-lg font-semibold text-gray-700">Team</h2>

                    <FormAsyncSelect
                        label={false}
                        isMulti={true}
                        name="user_ids"
                        control={control}
                        errors={errors}
                        placeholder="Members"
                        apiUrl={`/select/users?department_id=${generatedReqData?.service_request?.department_id}`}
                        queryKeyBase="users"
                        preselectedOptions={userOptions}
                    />
                </div>
            </div>


            <div className="xl:col-span-3 col-span-12">
                {serviceRequest.attachments.length > 0 && (
                    <SRAttachment attachments={serviceRequest.attachments}/>)}
            </div>

            <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
                    <h2 className="box-title text-lg font-semibold text-gray-700">
                        Sub Tasks
                    </h2>
                </div>
                {/*{task.children.length > 0 && (<TaskTree task={task} openTaskModal={openTaskModal}/>)}*/}

                <SubTaskList serviceRequest={serviceRequest.children}/>
            </div>

            <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
                    <h2 className="box-title text-lg font-semibold text-gray-700">
                        Approvals
                    </h2>
                </div>
                <div className="p-4 text-center text-gray-600">
                    No approvals found for this SR.
                </div>

                <div className="p-4">
                    <button
                        type="button"
                        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                        data-hs-overlay="#hs-toggle-between-modals-first-modal"
                    >
                        <i className="ri-add-line font-semibold align-middle"></i>
                        Add
                    </button>
                </div>

                <div
                    id="hs-toggle-between-modals-first-modal"
                    className="hs-overlay hidden ti-modal"
                >
                    <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                        <div className="ti-modal-content">
                            <div className="ti-modal-header">
                                <h6 className="ti-modal-title">Add Approval</h6>
                                <button
                                    type="button"
                                    className="hs-dropdown-toggle ti-modal-close-btn"
                                    data-hs-overlay="#hs-toggle-between-modals-first-modal"
                                    data-hs-overlay-close
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
                                        <path
                                            d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="ti-modal-body">
                                <p className="mt-1 text-gray-800 dark:text-[#8c9097] dark:text-white/50">
                                    To Email
                                </p>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 p-2 rounded mt-1"
                                    placeholder="Type to search recipient emails"
                                />
                            </div>

                            <div className="ti-modal-body mt-2">
                                <p className="mt-1 text-gray-800 dark:text-[#8c9097] dark:text-white/50">
                                    Comment
                                </p>
                                <textarea
                                    className="w-full border border-gray-300 p-2 rounded mt-1"
                                    placeholder="Add a comment..."
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="ti-modal-footer">
                                <button
                                    type="button"
                                    className="ti-btn ti-btn-primary-full"
                                    data-hs-overlay="#hs-toggle-between-modals-second-modal"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="ti-btn ti-btn-primary-full"
                                    data-hs-overlay="#hs-toggle-between-modals-second-modal"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Submission */}
            {/* <div className="flex justify-end p-4">
        <FormButton isLoading={isSubmitting} />
      </div> */}
        </form>
    );
};

export default ContentRight;

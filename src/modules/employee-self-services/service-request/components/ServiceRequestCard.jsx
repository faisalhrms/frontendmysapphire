import face5 from "@assets/images/faces/5.jpg";
import React, {useState} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

import {formatOptions} from "@helpers/formatters.js";

const ServiceRequestCard = ({serviceData, currentUser, control, setValue, errors}) => {

    const [files, setFiles] = useState([{id: 1, file: null}]);

    const addFileInput = () => {
        const newId = files.length + 1;
        setFiles([...files, {id: newId, file: null}]);
    };

    const handleFileChange = (event, index) => {
        const newFiles = [...files];
        newFiles[index].file = event.target.files[0];
        setFiles(newFiles);
    };

    const removeFileInput = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    return (
        <div className="xl:col-span-3 col-span-12">
            <div className="box bg-primary">
                <div className="flex items-start bg-primary p-4 rounded-xl shadow-md">
          <span className="avatar avatar-xl avatar-rounded mr-4">
            <img src={face5} alt="Profile" className="rounded-full w-16 h-16"/>
          </span>
                    <div className="flex-grow text-white">
                        <h6 className="font-semibold text-lg mb-1">
                            {serviceData?.reporter_user?.full_name || currentUser?.full_name}
                        </h6>
                        <p className="opacity-70 mb-1">
                            {serviceData?.reporter_user?.company?.name ||
                                currentUser?.company?.name}
                        </p>
                        <div className="flex items-center mb-2">
                            <div>
                                <p className="text-sm opacity-50 mb-0">{serviceData?.name}</p>
                                <p className="text-md font-normal mb-0 text-shadow">
                                    {(serviceData?.created_at
                                            ? new Date(serviceData.created_at)
                                            : new Date()
                                    ).toLocaleString() || "No Date"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm">{serviceData?.status || "In Service"}</p>
                            <p className="text-sm">
                                {serviceData?.startDate || "Mar 08, 2023"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="box">
                <div className="box-body p-4">
                    {files.map((file, index) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between bg-gray-100 rounded-md mb-3"
                        >
                            <input
                                type="file"
                                className="flex-grow border-none rounded-l-md mr-2 py-1"
                                onChange={(event) => handleFileChange(event, index)}
                            />
                            <div className="flex items-center rounded-r-md">
                                <i
                                    className="ri-eye-fill text-success"
                                    onClick={() => console.log("View file")}
                                ></i>
                                <i
                                    className="ri-delete-bin-5-fill text-danger"
                                    onClick={() => removeFileInput(index)}
                                ></i>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-start w-20">
                        <i
                            className="bi bi-plus-square text-success px-3 py-2 rounded-md cursor-pointer hover:bg-success-dark"
                            onClick={addFileInput}
                        ></i>
                    </div>
                </div>
            </div>

            <div className="box">
                <div className="box-body p-4">
                    <div className="xl:col-span-4 col-span-12 mt-4">
                        <FormInput
                            name="to_email"
                            control={control}
                            errors={errors}
                            placeholder="To"
                            readOnly
                        />
                    </div>

                    <div className="xl:col-span-4 col-span-12 mt-2 md-2">
                        <FormAsyncSelect
                            label="CC"
                            isMulti={true}
                            name="cc_email"
                            control={control}
                            errors={errors}
                            placeholder="CC"
                            apiUrl="/select/users-email"
                            queryKeyBase="users-email"
                            allowSaveNewOption={false}
                            preselectedOptions={formatOptions(
                                serviceData,
                                "cc_email",
                                "value",
                                "label"
                            )}
                            onOptionSelect={(selectedOption) => {
                                const emails = selectedOption.map((option) => option.value);
                                setValue("cc_email", emails);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestCard;

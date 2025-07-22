import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import {useCertificate} from "@modules/road-map/setup/certificates/hooks/useCertificate.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import FileUpload from "@components/FileUpload.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";

const CertificateForm = () => {
    const location = useLocation();
    const {id} = location.state || {};
    const {handleSubmit, control, errors, isSubmitting, onSubmit, certificate, watch} = useCertificate(id);
    return (
        <div>
            <PageHeader currentpage={id ? "Edit Certificate" : "Add Certificate"} activepage="Certificate"
                        mainpage={id ? "Edit Certificate" : "Add Certificate"}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="md:col-span-12 sm:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div
                                    className="box-title">{id && id !== ":id" ? "Edit Certificate" : "Add Certificate"}</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormAsyncSelect
                                            label={true}
                                            name="certificate_type"
                                            control={control}
                                            errors={errors}
                                            placeholder="Certificate Type"
                                            apiUrl="/select/roadmap/certificate-types/"
                                            queryKeyBase="certificate_type"
                                            preselectedOptions={formatOptions(certificate, "certificate_type", "id", "name")}
                                            saveOptionEndpoint="/select/roadmap/certificate-type/"
                                            allowSaveNewOption={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            name="name"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            placeholder="Certificate Name"/>
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <FileUpload
                                            currentValue={certificate?.media?.id || null}
                                            file={certificate?.media || null}
                                            inputName="media"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                    <FormButton isLoading={isSubmitting} type="submit"/>
                </div>
            </form>
        </div>
    );
};

export default CertificateForm;

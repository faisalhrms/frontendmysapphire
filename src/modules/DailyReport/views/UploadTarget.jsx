// pages/UploadTarget.jsx
import React from 'react';
import FormInputFile from '@components/form/FormInputFile.jsx';
import FormButton from '@components/form/FormButton.jsx';
import {useUploadTarget} from "@modules/DailyReport/hooks/useUploadTarget.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";


/**
 * Independent page/component to upload a file in a centered card.
 * Integrates with existing projectService.uploadProjects and uploadProjectSchema.
 * Rename or reuse for other upload endpoints by adjusting service and schema.
 */
const UploadTarget = ({
                          onSuccess,
                          onError,
                          redirectPath,
                          title = 'Upload File',
                      }) => {
    const { control, errors, isSubmitting, handleSubmit, mutation } = useUploadTarget({ onSuccess, onError, redirectPath });

    return (
        <>
            <PageHeader c currentpage="Target Upload" activepage="Retail"
                                  mainpage="Target Upload"/>

            <div className=" flex items-center justify-center mt-28  px-4">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">{title}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6 text-center">
                        <FormInputFile
                            control={control}
                            errors={errors}
                            name="file"
                            label="Choose file"
                        />
                        <FormButton text="Upload" isLoading={isSubmitting}/>
                    </form>
                    {mutation.isError && (
                        <p className="mt-4 text-red-500 text-sm">
                            Upload failed: {mutation.error?.message || 'Please try again.'}
                        </p>
                    )}
                    {mutation.isSuccess && (
                        <p className="mt-4 text-green-600 text-sm">Upload successful!</p>
                    )}
                </div>
            </div>

        </>
    );
};

export default UploadTarget;

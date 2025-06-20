import React, {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import DataTable from "@components/DataTable.jsx";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {
    getDownloadByEmpCode,
    getdeleteByEmpCode, handleDownloadHtml,
} from "../services/Service";
import Notify from "@helpers/toastNotifications.js";
import api from "@config/axiosConfig.js";

const SavedSignature = ({onEdit, handleSavedDataFetch}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSignatureId, setSelectedSignatureId] = useState(null);
    const [loading, setLoading] = useState(false);
    const {control, watch, formState: {errors}} = useForm({
        defaultValues: {}
    });

    const selectedCompany = watch("company_id"); // Watch the selected company

    const onOpenModal = (empCode) => {
        setSelectedSignatureId(empCode);
        setIsModalOpen(true);
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSignatureId(null);
    };

    const onConfirmDelete = async () => {
        try {
            if (!selectedSignatureId) return;
            await getdeleteByEmpCode(selectedSignatureId);
            Notify.success("Deleted successfully.");
        } catch (error) {
            Notify.error("Error during deletion:", error.message);
        } finally {
            onCloseModal();
        }
    };

    // Function to handle "Download All" button click
    const downloadAllScripts = async () => {
        if (!selectedCompany) {
            Notify.error("Please select a company to download related data.");
            return;
        }

        try {
            const response = await api.get('/signatures/download-all/', {
                params: {company_id: selectedCompany}, // Pass company_id as query param
                responseType: 'blob', // Ensure the response is treated as a binary file
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `signatures_${selectedCompany}.zip`); // Dynamic filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading scripts:", error);
            Notify.error("Failed to download scripts. Please try again.");
        }
    };

    const columns = [
        {Header: "Employee", accessor: "employee_code"},
        {Header: "Name", accessor: "name"},
        {Header: "Company", accessor: "company.name"},
        {
            Header: "Action",
            Cell: ({row}) => {
                const {employee_code} = row.original;
                return (
                    <div className="flex space-x-1">
                        <button
                            onClick={() => onOpenModal(employee_code)}
                            className="ti-btn ti-btn-danger ti-btn-sm"
                        >
                            <i className="ri-delete-bin-6-line"></i>
                        </button>
                        <button
                            onClick={() => handleSavedDataFetch(employee_code)}
                            className="ti-btn ti-btn-primary ti-btn-sm"
                        >
                            <i className="ri-edit-line"></i>
                        </button>
                        <button
                            onClick={() => getDownloadByEmpCode(employee_code)}
                            className="ti-btn ti-btn-primary ti-btn-sm"
                        >
                            <i className="ri-download-2-line"></i>
                        </button>
                        <button onClick={() => handleDownloadHtml(employee_code)}
                                className="ti-btn ti-btn-secondary ti-btn-sm">
                            <i className="ri-file-code-line"></i>
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 flex justify-between items-center">
                    <div className="flex-grow">
                        <FormAsyncSelect
                            label={false}
                            name="company_id"
                            control={control}
                            errors={errors}
                            placeholder="Company"
                            apiUrl="/select/companies"
                            queryKeyBase="companies"
                            clientSideSearch
                            preselectedOptions={[]}
                        />
                    </div>
                    <div className="ml-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md bg-primary flex items-center gap-2 hover:bg-primary-dark"
                            onClick={downloadAllScripts}
                        >
                            <i className="bx bxs-download"></i>
                            Download All
                        </button>
                    </div>
                </div>
            </div>


            <div className="mt-1">
                <DataTable
                    columns={columns}
                    filter={{selectedCompany}}
                    loading={loading}
                    apiUrl="/signatures/datatable/"
                />
            </div>

            <ConfirmationModal
                show={isModalOpen}
                message="Are you sure you want to delete this signature?"
                onConfirm={onConfirmDelete}
                onCancel={onCloseModal}
            />
        </div>
    );
};

export default SavedSignature;

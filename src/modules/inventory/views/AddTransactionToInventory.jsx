import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import equipmentSchema from "@modules/inventory/schemas/equipmentSchema.js";
import { useEquipmentForm } from "@modules/inventory/hooks/inventoryHooks.js";
import Table from "@components/Table.jsx";
import InventoryForm from "@modules/inventory/components/InventoryForm.jsx";

const AddTransactionToInventory = ({ equipmentData, isEditMode = false }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

    const tableConfig = {
        headers: [
            { label: 'Serial No', key: 'serialNumber' },
            { label: 'Site', key: 'site' },
            { label: 'Department', key: 'department' },
            { label: 'Physical Location', key: 'physicalLocation' },
            { label: 'Type', key: 'type' },
            { label: 'Asset Code', key: 'assetCode' },
            { label: 'Part No', key: 'partNumber' },
            { label: 'Status', key: 'status' },
            { label: 'Description', key: 'description' },
            { label: 'Specification', key: 'specification' },
        ],
        data: data,
    };


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const API_URL = 'https://6710c852a85f4164ef2f4661.mockapi.io/sapphire/test';
            try {
                const response = await fetch(API_URL);
                const result = await response.json();
                setData(result);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    function formatDate(rawDate) {
        const date = new Date(rawDate);
        // Format the date: Month Day, Year (e.g., February 19, 2042)
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formattedDate;
    }
    const { control,handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            ...equipmentData
        }
    });
    const { handleEquipmentSubmit } = useEquipmentForm(equipmentData, isEditMode);
    useEffect(() => {
        if (equipmentData) {
            Object.keys(equipmentData).forEach(key => {
                setValue(key, equipmentData[key]);
            });
        }
    }, [equipmentData, setValue]);
    return (
        <>
            <h1 className="text-2xl font-bold mb-2 mt-6"></h1>
            <InventoryForm
                equipmentData={equipmentData}
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                handleEquipmentSubmit={handleEquipmentSubmit}
            />

            <div className="grid grid-cols-12 gap-x-6 mt-2">
                <div className="col-span-12">
                    <div className="box p-4 shadow-md rounded-md">
                        <Table tableConfig={tableConfig}/>
                    </div>
                </div>
            </div>

        </>
    );
};

export default AddTransactionToInventory;

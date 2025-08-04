import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {CalendarRange} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {useYearSetupModal} from "@modules/hrms/hooks/useYearSetupModal.js";
import YearSetupModal from "@modules/hrms/components/modals/YearSetupModal.jsx";

const YearSetup = () => {
    const dataTableRef = React.useRef();
    const columns = [
        {
            Header: 'Type',
            accessor: 'type',
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                let bgClass = "";
                if (value.includes("objective")) {
                    bgClass = "bg-success";
                } else {
                    bgClass = "bg-primary";
                }
                return {
                    className: `text-white ${bgClass}`,
                };
            },
        },
        {
            Header: 'Year',
            accessor: 'year',
        },
        {
            Header: 'Started Date',
            accessor: 'started_at',
        },
        {
            Header: 'Ended Date',
            accessor: 'ended_at',
        },
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ value }) => (
                    <div className="flex space-x-2">
                            <button
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                title="Edit User"
                                onClick={() => openModal(value, true)}
                            >
                                <i className="ri-edit-line"></i>
                            </button>
                    </div>
            ),

        },
        ]

    const {
        openModal,
        closeModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isEditMode,
    } = useYearSetupModal(() => dataTableRef.current?.refetch());

    const buttons = (
            <div className="flex space-x-2">
                <button
                    type="button"
                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                    onClick={() => openModal()}
                >
                    <i className="ri-add-line font-semibold align-middle"></i>
                </button>
            </div>
    );
    return (
        <>
            <IconPageHeader
                heading="Year Setup"
                description="Configure fiscal or operational year settings in the PMS."
                icon={CalendarRange}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/setups/year/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />

            <YearSetupModal
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                closeModal={closeModal}
                isEditMode={isEditMode}
            />
        </>
    );
};

export default YearSetup;

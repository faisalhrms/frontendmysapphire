import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { Link } from "react-router-dom";
import { INVENTORY_ROUTES } from "@modules/inventory/routes.js";
import { toTitleCase } from "@helpers/formatters.js";

const EquipmentList = () => {
    const columns = [
        { Header: "Code", accessor: "code" },

        { Header: "Serial No", accessor: "serial_no" },
        { Header: "Status", accessor: "status", Cell: ({ value }) => toTitleCase(value) },
        { Header: "Custodian", accessor: "custodian.full_name" },
        { Header: "Department", accessor: "department" },
        { Header: "Equipment Site", accessor: "equipment_site" },
        { Header: "Equipment Type", accessor: "equipment_type" },
        { Header: "Location", accessor: "location" },
        {
            Header: "Actions",
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link to={`/module/equipment/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                    <Link to={`/module/equipment/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link to={INVENTORY_ROUTES.ADD.path} className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                <i className="ri-add-line font-semibold align-middle"></i> Add Equipment
            </Link>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="Equipments" mainpage="Equipments" />
            <DataTable
                columns={columns}
                title="Equipments"
                apiUrl="/equipments/datatable/"
                buttons={buttons}
            />
        </>
    );
};

export default EquipmentList;

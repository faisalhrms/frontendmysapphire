import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import {Link} from "react-router-dom";
import {SLA_SETUP_ROUTES} from "@modules/sr-management/sla-setup/routes.js";


const SlaSetupList = () => {

    const columns = [
        {
            Header: "Actions",
            Cell: ({row}) => (
                <div className="flex space-x-2">
                    <Link to={SLA_SETUP_ROUTES.CREATE.path} state={{id: row.original.id}}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        {Header: "Activity", accessor: "name"},
        {Header: "SLA Days", accessor: "sla_days"},
        {
            Header: "Sub Department",
            accessor: "sub_department.name"
        },
        {
            Header: "Department",
            accessor: "department.name"
        },
        {
            Header: "Company",
            accessor: "company.name",
        },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={SLA_SETUP_ROUTES.CREATE.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add
            </Link>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="SLA Setup" mainpage="SLA Setup"/>
            <DataTable
                columns={columns}
                title="SLA Setup"
                apiUrl="sr_sla/datatable/"
                buttons={buttons}
            />
        </>
    );
};

export default SlaSetupList;

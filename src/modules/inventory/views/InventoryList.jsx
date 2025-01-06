import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import {Link} from "react-router-dom";
import  {INVENTORY_ROUTES} from "@modules/inventory/routes.js";

const InventoryList = () => {
    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1 ">
            <Link to={INVENTORY_ROUTES.ADD.path} className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                <i className="ri-add-line font-semibold align-middle"></i> Add Equipment
            </Link>
        </div>
    );
    return (
        <>
            <PageHeader currentpage="Equipments" mainpage="Equipments"/>
            <DataTable
                columns={[]}
                title="Equipments"
                apiUrl=""
                buttons={buttons}
            />
        </>
    )
}

export default InventoryList;
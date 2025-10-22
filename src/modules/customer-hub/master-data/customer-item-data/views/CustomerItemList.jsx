import React, {useRef, useState} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { CUSTOMER_ITEMS } from "@modules/customer-hub/routes.js";
import UploadMasterModal from "@modules/customer-hub/master-data/components/UploadMasterModal.jsx";
import {
    downloadCustomerItemsTemplate, uploadCustomerItems
} from "@modules/customer-hub/master-data/customer-item-data/services/CustomerItemService.js";

const CustomerItemList = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const dataTableRef = useRef();

  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
          <div className="flex justify-center space-x-2">
          <Link to={CUSTOMER_ITEMS.CREATE.path} state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      )
    },
    { Header: "Processed Code", accessor: "processed_item_code" },
    { Header: "Greige Code", accessor: "greige_item_code" },
    { Header: "Quality", accessor: "quality_code" },
    { Header: "Finished Design", accessor: "finished_design_description", Cell: ({ value }) => toTitleCase(value ?? "N/A") },
    { Header: "Finished Color", accessor: "finished_color_description", Cell: ({ value }) => toTitleCase(value ?? "N/A") },
    { Header: "Design Code", accessor: "finished_design_code" },
    { Header: "Color Code", accessor: "finished_color_code" },
    { Header: "Customer", accessor: "customer_name", Cell: ({ value }) => toTitleCase(value ?? "N/A") },
    { Header: "Weave", accessor: "weave" },
    { Header: "Selvedge", accessor: "selvedge" },
    { Header: "Greige Width", accessor: "greige_width" },
    { Header: "Width (In)", accessor: "finished_width_inches" },
    { Header: "Width (Cm)", accessor: "finished_width_cm" },
  ];

  const buttons = (
    <div className="flex items-center gap-2">
      <Link to={CUSTOMER_ITEMS.CREATE.path}>
        <button className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
          <i className="ri-add-line" />
        </button>
      </Link>
      <button onClick={() => downloadCustomerItemsTemplate()} className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]">
        <i className="ri-download-2-line" />
      </button>
      <button type="button" onClick={() => setIsUploadModalOpen(true)} className="hs-dropdown-toggle ti-btn ti-btn-warning-full !py-1 !px-2 !text-[0.75rem]">
        <i className="ri-upload-cloud-2-line" />
      </button>
    </div>
  );

  return (
    <>
      <DataTable columns={columns} title="Customer Items" apiUrl="customer-hub/customer-items/datatable/" ref={dataTableRef} externalFilters={['tab']} buttons={buttons} />
      {isUploadModalOpen && (
        <UploadMasterModal
          title="Upload Customer Items"
          uploadFn={(file, extra) => uploadCustomerItems(file, { ...extra })}
          extraParams={{}}
          closeModal={() => setIsUploadModalOpen(false)}
          onUploaded={() => {}}
        />
      )}
    </>
  );
};

export default CustomerItemList;

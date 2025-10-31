import React, { useRef, useState } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { GREIGE_LEAD_TIMES } from "@modules/customer-hub/routes.js";
import UploadMasterModal from "@modules/customer-hub/master-data/components/UploadMasterModal.jsx";
import {
    exportGreigeLeadTimes,
    uploadGreigeLeadTimes
} from "@modules/customer-hub/master-data/greige-lead-times/services/GreigeLeadTimeService.js";

const GreigeLeadTimeList = () => {
  const dataTableRef = useRef();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [vendorNo, setVendorNo] = useState("");
  const [qualityCode, setQualityCode] = useState("");
  const [key, setKey] = useState(Date.now())
  const refresh = () => setKey(Date.now())

  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Link to={GREIGE_LEAD_TIMES.CREATE.path} state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      ),
    },
    { Header: "Vendor No.", accessor: "vendor_no" },
    { Header: "Main Group", accessor: "main_group", Cell: ({ value }) => toTitleCase(value ?? "N/A") },
    { Header: "Quality", accessor: "quality_code" },
    { Header: "Loom Type", accessor: "loom_type", Cell: ({ value }) => toTitleCase(value ?? "N/A") },
    { Header: "Greige / Yarn Dyed", accessor: "fabric_type", Cell: ({ value }) => toTitleCase(value ?? "N/A") },
    { Header: "Lead Time (Days)", accessor: "lead_time_days" },
  ];

  const buttons = (
    <div className="flex items-center gap-2">
      <Link to={GREIGE_LEAD_TIMES.CREATE.path}>
        <button className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
          <i className="ri-add-line" />
        </button>
      </Link>
      <button
        onClick={() => exportGreigeLeadTimes({ vendor_no: vendorNo, quality_code: qualityCode })}
        className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-download-2-line" />
      </button>
      <button
        type="button"
        onClick={() => setIsUploadModalOpen(true)}
        className="hs-dropdown-toggle ti-btn ti-btn-warning-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-upload-cloud-2-line" />
      </button>
    </div>
  );

  return (
    <>
      <DataTable
        columns={columns}
        title="Greige Lead Times"
        apiUrl="customer-hub/greige-lead-times/datatable/"
        ref={dataTableRef}
        externalFilters={["tab"]}
        buttons={buttons}
        key={key}
      />
      {isUploadModalOpen && (
        <UploadMasterModal
          title="Upload Greige Lead Times"
          uploadFn={(file, extra) => uploadGreigeLeadTimes(file, { ...extra, vendor_no: vendorNo, quality_code: qualityCode })}
          extraParams={{}}
          closeModal={() => setIsUploadModalOpen(false)}
          onUploaded={() => {}}
          refreshTable={refresh}
        />
      )}
    </>
  );
};
export default GreigeLeadTimeList;

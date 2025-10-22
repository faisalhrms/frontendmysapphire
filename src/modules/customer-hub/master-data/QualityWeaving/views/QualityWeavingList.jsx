import React, {useRef, useState} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import UploadMasterModal from "@modules/customer-hub/master-data/components/UploadMasterModal.jsx";
import { Link } from "react-router-dom";
import {
    exportQualityWeaving,
    uploadQualityWeaving
} from "@modules/customer-hub/master-data/QualityWeaving/services/QualityWeavingService.js";
import {QUALITY_WEAVING} from "@modules/customer-hub/routes.js";

const QualityWeavingList = () => {
  const dataTableRef = useRef();
  const [open, setOpen] = useState(false);

  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <Link to={QUALITY_WEAVING.CREATE.path} state={{ id: row.original.id }}>
          <button className="ti-btn ti-btn-primary ti-btn-sm"><i className="ri-edit-line" /></button>
        </Link>
      ),
    },
    { Header: "Quality", accessor: "quality_code" },
    { Header: "Airjet/Sulzer", accessor: "machine_type" },
    { Header: "Loom Type", accessor: "loom_type" },
    { Header: "Weft Method", accessor: "weft_method" },
  ];

  const buttons = (
    <div className="flex items-center gap-2">
      <Link to={QUALITY_WEAVING.CREATE.path} className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"><i className="ri-add-line" /></Link>
      <button onClick={() => exportQualityWeaving()} className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"><i className="ri-download-2-line" /></button>
      <button onClick={() => setOpen(true)} className="ti-btn ti-btn-warning-full !py-1 !px-2 !text-[0.75rem]"><i className="ri-upload-cloud-2-line" /></button>
    </div>
  );

  return (
    <>
      <DataTable columns={columns} title="Quality Weaving" apiUrl="customer-hub/quality-weaving/datatable/" externalFilters={['tab']} ref={dataTableRef} buttons={buttons} />
      {open && (
        <UploadMasterModal
          title="Upload Quality Weaving"
          uploadFn={(file) => uploadQualityWeaving(file)}
          extraParams={{}}
          closeModal={() => setOpen(false)}
          onUploaded={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default QualityWeavingList;

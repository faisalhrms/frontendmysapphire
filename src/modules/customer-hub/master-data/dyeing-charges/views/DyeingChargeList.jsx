import React, {useRef, useState} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { DYEING_CHARGES } from "@modules/customer-hub/routes.js";
import { exportDyeingCharges, uploadDyeingCharges } from "../services/DyeingChargeService.js";
import UploadMasterModal from "@modules/customer-hub/master-data/components/UploadMasterModal.jsx";

const DyeingChargeList = () => {
  const dataTableRef = useRef();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [qualityCode, setQualityCode] = useState("");

  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
          <div className="flex justify-center space-x-2">
          <Link to={DYEING_CHARGES.CREATE.path} state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      )
    },
    { Header: "Quality", accessor: "quality_code" },
    { Header: "Design", accessor: "design_name", Cell: ({ value }) => toTitleCase(value ?? "N/A") },
    { Header: "Color", accessor: "color_name", Cell: ({ value }) => toTitleCase(value ?? "N/A") },
    { Header: "Warp", accessor: "warp_charges" },
    { Header: "Weft", accessor: "weft_charges" },
    { Header: "Warp Cov.", accessor: "warp_coverage" },
    { Header: "Weft Cov.", accessor: "weft_coverage" },
    { Header: "Design Code", accessor: "design_code" },
    { Header: "Color Code", accessor: "color_code" },
    { Header: "Design Full", accessor: "design" }
  ];

  const buttons = (
    <div className="flex items-center gap-2">
      <Link to={DYEING_CHARGES.CREATE.path}>
        <button className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
          <i className="ri-add-line" />
        </button>
      </Link>
      <button onClick={() => exportDyeingCharges({ quality_code: qualityCode })} className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]">
        <i className="ri-download-2-line" />
      </button>
      <button type="button" onClick={() => setIsUploadModalOpen(true)} className="hs-dropdown-toggle ti-btn ti-btn-warning-full !py-1 !px-2 !text-[0.75rem]">
        <i className="ri-upload-cloud-2-line" />
      </button>
    </div>
  );

  return (
    <>
      <DataTable columns={columns} title="Dyeing Charges" apiUrl="customer-hub/dyeing-charges/datatable/" ref={dataTableRef} externalFilters={['tab']} buttons={buttons} />
      {isUploadModalOpen && (
        <UploadMasterModal
          title="Upload Dyeing Charges"
          uploadFn={(file, extra) => uploadDyeingCharges(file, { ...extra, quality_code: qualityCode })}
          extraParams={{}}
          closeModal={() => setIsUploadModalOpen(false)}
          onUploaded={() => {}}
        />
      )}
    </>
  );
};
export default DyeingChargeList;

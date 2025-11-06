import React, { useRef, useState } from "react"
import DataTable from "@components/datatable/DataTable.jsx"
import UploadMasterModal from "@modules/customer-hub/master-data/components/UploadMasterModal.jsx"
import { toTitleCase } from "@helpers/formatters.js"
import { Link } from "react-router-dom"
import {
  exportWeavingParameters,
  uploadWeavingParameters
} from "@modules/customer-hub/master-data/WeavingParameter/services/WeavingParameterService.js"
import { WEAVING_PARAMETER } from "@modules/customer-hub/routes.js"

const WeavingParameterList = () => {
  const dataTableRef = useRef()
  const [open, setOpen] = useState(false)

  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <Link to={WEAVING_PARAMETER.CREATE.path} state={{ id: row.original.id }}>
          <button className="ti-btn ti-btn-primary ti-btn-sm">
            <i className="ri-edit-line" />
          </button>
        </Link>
      )
    },
    { Header: "Weft", accessor: "weft_method" },
    { Header: "Fabric Type", accessor: "process_type" },
    { Header: "Loom Type", accessor: "loom_type" },
    { Header: "Airjet/Sulzer", accessor: "machine_type" },
    {
      Header: "Weave",
      accessor: "weave",
      Cell: ({ value }) => toTitleCase(value || "N/A")
    },
    { Header: "Wider Speed", accessor: "wider_loom_speed" },
    { Header: "Wider Eff%", accessor: "wider_efficiency" },
    { Header: "Wider Reject%", accessor: "wider_reject_percent" },
    { Header: "Narrow Speed", accessor: "narrow_loom_speed" },
    { Header: "Narrow Eff%", accessor: "narrow_efficiency" },
    { Header: "Narrow Reject%", accessor: "narrow_reject_percent" },
    { Header: "Recovery", accessor: "recovery" },
    { Header: "Wider Dye%", accessor: "wider_dyeing_cost_percent" },
    { Header: "Wider Pack/Yd", accessor: "wider_packing_cost_per_yard" },
    { Header: "Narrow Dye%", accessor: "narrow_dyeing_cost_percent" },
    { Header: "Narrow Pack/Yd", accessor: "narrow_packing_cost_per_yard" }
  ]

  const buttons = (
    <div className="flex items-center gap-2">
      <Link
        to={WEAVING_PARAMETER.CREATE.path}
        className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line" />
      </Link>
      <button
        onClick={() => exportWeavingParameters()}
        className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-download-2-line" />
      </button>
      <button
        onClick={() => setOpen(true)}
        className="ti-btn ti-btn-warning-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-upload-cloud-2-line" />
      </button>
    </div>
  )

  return (
    <>
      <DataTable
        columns={columns}
        title="Weaving Parameters"
        apiUrl="customer-hub/weaving-params/datatable/"
        externalFilters={["tab"]}
        ref={dataTableRef}
        buttons={buttons}
      />
      {open && (
        <UploadMasterModal
          title="Upload Weaving Parameters"
          uploadFn={(file) => uploadWeavingParameters(file)}
          extraParams={{}}
          closeModal={() => setOpen(false)}
          onUploaded={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default WeavingParameterList

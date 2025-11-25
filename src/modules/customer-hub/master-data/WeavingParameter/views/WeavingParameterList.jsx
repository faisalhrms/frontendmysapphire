import React, { useRef, useState, useCallback } from "react"
import DataTable from "@components/datatable/DataTable.jsx"
import UploadMasterModal from "@modules/customer-hub/master-data/components/UploadMasterModal.jsx"
import { toTitleCase } from "@helpers/formatters.js"
import { Link } from "react-router-dom"
import {
  exportWeavingParameters,
  uploadWeavingParameters,
  deleteWeavingParameter,
} from "@modules/customer-hub/master-data/WeavingParameter/services/WeavingParameterService.js"
import { WEAVING_PARAMETER } from "@modules/customer-hub/routes.js"
import AlertModalPortal from "@components/AlertModalPortal.jsx" // NEW

const WeavingParameterList = () => {
  const dataTableRef = useRef()
  const [open, setOpen] = useState(false)

  const [deleteId, setDeleteId] = useState(null)
  const [deleteLabel, setDeleteLabel] = useState("")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = useCallback((row) => {
    const orig = row.original || {}
    const labelParts = [
      orig.weft_method,
      orig.process_type,
      orig.loom_type,
      orig.machine_type,
      orig.weave,
    ].filter(Boolean)
    const label = labelParts.join(" / ") || orig.id

    setDeleteId(orig.id)
    setDeleteLabel(label)
    setIsDeleteOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteWeavingParameter(deleteId)
      // refresh datatable via exposed refetch on DataTable
      if (dataTableRef.current?.refetch) {
        await dataTableRef.current.refetch()
      }
    } finally {
      setIsDeleting(false)
      setIsDeleteOpen(false)
      setDeleteId(null)
      setDeleteLabel("")
    }
  }, [deleteId])

  const columns = [
    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Link to={WEAVING_PARAMETER.CREATE.path} state={{ id: row.original.id }}>
            <button type="button" className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line" />
            </button>
          </Link>
          <button
            type="button"
            className="ti-btn ti-btn-danger ti-btn-sm"
            onClick={() => handleDeleteClick(row)}
          >
            <i className="ri-delete-bin-6-line" />
          </button>
        </div>
      ),
    },
    { Header: "Weft", accessor: "weft_method" },
    { Header: "Fabric Type", accessor: "process_type" },
    { Header: "Loom Type", accessor: "loom_type" },
    { Header: "Airjet/Sulzer", accessor: "machine_type" },
    {
      Header: "Weave",
      accessor: "weave",
      Cell: ({ value }) => toTitleCase(value || "N/A"),
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
    { Header: "Narrow Pack/Yd", accessor: "narrow_packing_cost_per_yard" },
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
        type="button"
        onClick={() => exportWeavingParameters()}
        className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-download-2-line" />
      </button>
      <button
        type="button"
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

      <AlertModalPortal
        id="weaving-param-delete"
        isOpen={isDeleteOpen}
        type="danger"
        title="Delete weaving parameter"
        message={
          deleteLabel
            ? `Are you sure you want to delete weaving parameter (${deleteLabel})?`
            : "Are you sure you want to delete this weaving parameter?"
        }
        btnTxt="Yes, delete"
        isSubmitting={isDeleting}
        needInput={false}
        inputLabel=""
        onConfirm={handleDeleteConfirm}
        onClose={setIsDeleteOpen}
      />
    </>
  )
}

export default WeavingParameterList

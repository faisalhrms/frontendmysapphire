import React, { useRef, useState, useCallback } from "react"
import DataTable from "@components/datatable/DataTable.jsx"
import { Link } from "react-router-dom"
import { SIZING_COST } from "@modules/customer-hub/routes.js"
import { deleteSizing } from "@modules/customer-hub/master-data/sizing-cost/services/SizingCostService.js"
import AlertModalPortal from "@components/AlertModalPortal.jsx"

const SizingCostList = () => {
  const dataTableRef = useRef()

  const [deleteId, setDeleteId] = useState(null)
  const [deleteLabel, setDeleteLabel] = useState("")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = useCallback((row) => {
    const orig = row.original || {}
    const label =
      orig.range_label ||
      (orig.warp_min != null && orig.warp_max != null
        ? `Warp ${orig.warp_min}–${orig.warp_max}`
        : `Rule #${orig.id}`)

    setDeleteId(orig.id)
    setDeleteLabel(label)
    setIsDeleteOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteSizing(deleteId)
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
          <Link to={SIZING_COST.CREATE.path} state={{ id: row.original.id }}>
            <button
              type="button"
              className="ti-btn ti-btn-primary ti-btn-sm"
              title="Edit"
            >
              <i className="ri-edit-line" />
            </button>
          </Link>
          <button
            type="button"
            className="ti-btn ti-btn-danger ti-btn-sm"
            title="Delete"
            onClick={() => handleDeleteClick(row)}
          >
            <i className="ri-delete-bin-6-line" />
          </button>
        </div>
      )
    },
    {
      Header: "Range",
      accessor: "range_label",
      Cell: ({ value }) => value || "—"
    },
    { Header: "Min", accessor: "warp_min" },
    { Header: "Max", accessor: "warp_max" },
    {
      Header: "Sizing Cost",
      accessor: "sizing_cost",
      Cell: ({ value }) => (value != null ? Number(value).toFixed(2) : "0.00")
    }
  ]

  const buttons = (
    <div className="grid grid-cols-1">
      <Link
        to={SIZING_COST.CREATE.path}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line font-semibold align-middle" />
      </Link>
    </div>
  )

  return (
    <>
      <DataTable
        title="Sizing Cost"
        ref={dataTableRef}
        externalFilters={["tab"]}
        columns={columns}
        apiUrl="customer-hub/sizing-cost/datatable/"
        buttons={buttons}
      />

      <AlertModalPortal
        id="sizing-cost-delete"
        isOpen={isDeleteOpen}
        type="danger"
        title="Delete sizing cost rule"
        message={
          deleteLabel
            ? `Are you sure you want to delete sizing cost rule (${deleteLabel})?`
            : "Are you sure you want to delete this sizing cost rule?"
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

export default SizingCostList

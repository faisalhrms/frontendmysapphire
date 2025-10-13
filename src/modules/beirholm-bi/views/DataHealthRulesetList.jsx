import React, { useState } from "react"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import DataTable from "@components/datatable/DataTable.jsx"
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx"
import { ListChecks, PlayCircle, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js"
import ConfirmDeleteModal from "@modules/beirholm-bi/components/ConfirmDeleteModal.jsx"
import {deleteRule, runDataHealth} from "@modules/beirholm-bi/services/DataHealthService.js"

const Badge = ({ children }) => <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-500/10 text-slate-600 dark:text-slate-400">{children}</span>

const StatusBadge = ({ status, startedAt, finishedAt, error }) => {
  const s = status || "ready"
  const cls = {
    ready: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    running: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    error: "bg-red-500/10 text-red-600 dark:text-red-400"
  }[s]
  const Icon = s === "running" ? Loader2 : s === "success" ? CheckCircle2 : s === "error" ? XCircle : PlayCircle
  const label = s === "ready" ? "Ready" : s.charAt(0).toUpperCase() + s.slice(1)
  const ts = s === "running" ? startedAt : finishedAt
  return (
    <div className="flex items-center justify-center gap-2">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${cls}`}>
        <Icon size={14} className={s === "running" ? "animate-spin" : ""} />
        <span>{label}</span>
      </span>
      {ts && <span className="text-xs opacity-60">{dayjs(ts).format("HH:mm:ss")}</span>}
      {s === "error" && error && <span className="text-xs text-red-500 line-clamp-1 max-w-[180px]">{error}</span>}
    </div>
  )
}

const DataHealthRulesList = () => {
  const [tableKey, setTableKey] = useState(Date.now())
  const [runningAll, setRunningAll] = useState(false)
  const [pendingHeader, setPendingHeader] = useState(null)
  const refreshTable = () => setTableKey(Date.now())
  const [deleteId, setDeleteId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const runAll = async () => {
    try {
      setRunningAll(true)
      await runDataHealth({})
      refreshTable()
    } finally {
      setRunningAll(false)
    }
  }

  const runForHeader = async (headerId) => {
    if (!headerId) return
    try {
      setPendingHeader(headerId)
      await runDataHealth({ header_id: headerId })
      refreshTable()
    } finally {
      setPendingHeader(null)
    }
  }
  const closeConfirmModal = () => {
    setDeleteId(null);
    setIsConfirmModalOpen(false);
  };
  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => {
        const hid = row.original.header?.id
        const isRunning = row.original.exec_status === "running" || pendingHeader === hid || runningAll
        return (
          <div className="flex space-x-2 justify-center">
            <button onClick={() => runForHeader(hid)} disabled={!hid || isRunning} className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem]" title="Execute">
              {isRunning ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
            </button>
            <Link to={BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_CREATE.path} state={{ headerId: hid }}>
              <button className="ti-btn ti-btn-primary ti-btn-sm" title="Edit">
                <i className="ri-edit-line" />
              </button>
            </Link>
              <button
                onClick={() => { setDeleteId(row.original.header.id); setIsConfirmModalOpen(true); }}
                className="ti-btn ti-btn-danger ti-btn-sm"
                title="Delete"
              >
            <i className="ri-delete-bin-line" />
          </button>
          </div>
        )
      },
      width: 200
    },
    { Header: "Header", accessor: "header", Cell: ({ value }) => <div className="text-center"><span>{value?.name || "N/A"}</span></div> },
    { Header: "Rules", accessor: "rules_count", Cell: ({ value }) => <div className="flex justify-center"><Badge>{value}</Badge></div>, width: 100 },
{
      Header: "Exec Status",
      accessor: "exec_status",
      Cell: ({ row }) => (
        <StatusBadge
          status={row.original.exec_status}
          startedAt={row.original.exec_started_at}
          finishedAt={row.original.exec_finished_at}
          error={row.original.exec_error}
        />
      ),
      width: 220
    },
  ]

  const buttons = (
    <div className="flex items-center gap-2">
      <button onClick={runAll} disabled={runningAll} className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]" title="Execute All">
        {runningAll ? <Loader2 size={16} className="inline-block animate-spin" /> : <PlayCircle size={16} className="inline-block" />}
      </button>
      <Link to={BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_CREATE.path} className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]" title="Add Rule">
        <i className="ri-add-line font-semibold align-middle" />
      </Link>
    </div>
  )

  return (
    <>
      <IconPageHeader heading="Data Health Flows" description="Manage header-level validation flows" icon={ListChecks} />
      <DataTable key={tableKey} columns={columns} title="Rules" apiUrl="beirholm-bi/health/rulesets/datatable/" buttons={buttons} />
        {isConfirmModalOpen && deleteId && (
        <ConfirmDeleteModal
          bodyMessage="Are you sure you want to delete this flow?"
          closeModal={closeConfirmModal}
          onConfirm={async () => {
            await deleteRule(deleteId);
            refreshTable();
          }}
        />
      )}
    </>
  )
}

export default DataHealthRulesList

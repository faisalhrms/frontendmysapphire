import React, { useEffect, useState } from "react"
import { datatableAgreements, approveAgreement, rejectAgreement } from "@modules/customer-hub/customer-orders/services/AgreementService.js"

const Cell = ({ children }) => <td className="px-3 py-2 text-sm">{children}</td>

const AgreementsTable = () => {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [s, setS] = useState("")

  const fetchData = async () => {
    const res = await datatableAgreements({ skip, limit, s })
    setRows(res?.results || res?.items || [])
    setTotal(res?.count || 0)
  }

  useEffect(() => { fetchData() }, [skip, limit, s])

  return (
    <div className="rounded-xl border dark:border-defaultborder/20 overflow-hidden">
      <div className="p-3 flex items-center justify-between gap-3">
        <input value={s} onChange={(e) => setS(e.target.value)} placeholder="Search" className="ti-form-input w-64" />
        <div className="text-sm opacity-70">Total {total}</div>
      </div>
      <table className="min-w-full border-t dark:border-defaultborder/20">
        <thead className="bg-slate-50 dark:bg-defaultbackground">
          <tr className="text-left text-xs uppercase tracking-wide">
            <th className="px-3 py-2">Agreement</th>
            <th className="px-3 py-2">Source</th>
            <th className="px-3 py-2">Owner</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Submitted By</th>
            <th className="px-3 py-2">Approved By</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t dark:border-defaultborder/20">
              <Cell>{r.agreement_no}</Cell>
              <Cell><span className="px-2 py-1 rounded-full bg-slate-700/5 dark:bg-white/10 text-xs">{r.source}</span></Cell>
              <Cell>{r.owner || "-"}</Cell>
              <Cell>{r.status}</Cell>
              <Cell>{r.submitted_by_name || "-"}</Cell>
              <Cell>{r.approved_by_name || "-"}</Cell>
              <Cell className="space-x-2">
                <button onClick={async () => { await approveAgreement(r.id); fetchData() }} disabled={r.status !== "submitted"} className="ti-btn ti-btn-success !mb-0 !px-2 !py-1 text-xs disabled:opacity-50">Approve</button>
                <button onClick={async () => { await rejectAgreement(r.id); fetchData() }} disabled={r.status === "approved"} className="ti-btn ti-btn-danger !mb-0 !px-2 !py-1 text-xs disabled:opacity-50">Reject</button>
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 flex items-center justify-between">
        <div className="space-x-2">
          <button onClick={() => setSkip(Math.max(0, skip - limit))} className="ti-btn ti-btn-light !mb-0 text-sm">Prev</button>
          <button onClick={() => setSkip(skip + limit)} className="ti-btn ti-btn-light !mb-0 text-sm">Next</button>
        </div>
        <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} className="ti-form-select w-24">
          <option>10</option><option>25</option><option>50</option>
        </select>
      </div>
    </div>
  )
}

export default AgreementsTable

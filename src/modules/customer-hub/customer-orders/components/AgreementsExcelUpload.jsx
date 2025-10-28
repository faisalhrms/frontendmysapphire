import React, { useState } from "react"
import { uploadAgreementsExcel } from "@modules/customer-hub/customer-orders/services/AgreementService.js"

const AgreementsExcelUpload = ({ onDone }) => {
  const [file, setFile] = useState(null)
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!file) return
    setLoading(true)
    const r = await uploadAgreementsExcel(file)
    setRes(r)
    setLoading(false)
    if (onDone) onDone(r)
  }

  return (
    <div className="rounded-xl border dark:border-defaultborder/20 p-4 space-y-3">
      <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} className="ti-form-input" />
      <button onClick={submit} className="ti-btn ti-btn-primary !mb-0 text-sm" disabled={loading || !file}>{loading ? "Uploading..." : "Upload"}</button>
      {res && (
        <div className="text-sm opacity-80">Created {res.created} Updated {res.updated || 0}</div>
      )}
    </div>
  )
}

export default AgreementsExcelUpload

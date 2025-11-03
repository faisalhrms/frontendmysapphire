import React from "react"
import { Save, Forward } from "lucide-react"

const AgreementActions = ({ onSaveDraft, onSubmit, disabledSubmit, disabled, hideSubmit = false }) => (
  <div className="col-span-12 flex justify-end gap-2 pt-2">
    <button type="button" onClick={onSaveDraft} disabled={disabled} className="ti-btn ti-btn-secondary !mb-0 inline-flex items-center gap-2 text-sm">
      <Save size={16} /> Save
    </button>
    {!hideSubmit && (
      <button type="button" onClick={onSubmit} disabled={disabledSubmit || disabled} className="ti-btn ti-btn-success !mb-0 inline-flex items-center gap-2 text-sm">
        <Forward size={16} /> Submit
      </button>
    )}
  </div>
)

export default AgreementActions

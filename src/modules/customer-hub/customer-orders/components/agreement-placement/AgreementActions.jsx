import React from "react";
import { Forward, Save, Check, X } from "lucide-react";

const AgreementActions = ({
  onSaveDraft,
  onSubmit,
  disabled,
  disabledSubmit,
  hideSubmit = false,
  hideSave = false,
  mode = "edit",
  onApprove,
  onReject,
  disabledApprove,
  disabledReject,
}) => {
  const isApproval = mode === "approval";

  if (!isApproval && hideSave && hideSubmit) return null;

  if (isApproval) {
    if (!onApprove && !onReject) return null;
    return (
      <div className="col-span-12 flex justify-end gap-2 pt-2">
        {onReject && (
          <button
            type="button"
            onClick={onReject}
            disabled={disabledReject}
            className="ti-btn ti-btn-danger !mb-0 inline-flex items-center gap-2 text-sm"
          >
            <X size={16} /> Reject
          </button>
        )}
        {onApprove && (
          <button
            type="button"
            onClick={onApprove}
            disabled={disabledApprove}
            className="ti-btn ti-btn-success !mb-0 inline-flex items-center gap-2 text-sm"
          >
            <Check size={16} /> Approve
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="col-span-12 flex justify-end gap-2 pt-2">
      {!hideSave && (
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={disabled}
          className="ti-btn ti-btn-secondary !mb-0 inline-flex items-center gap-2 text-sm"
        >
          <Save size={16} /> Save
        </button>
      )}
      {!hideSubmit && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabledSubmit || disabled}
          className="ti-btn ti-btn-success !mb-0 inline-flex items-center gap-2 text-sm"
        >
          <Forward size={16} /> Submit
        </button>
      )}
    </div>
  );
};

export default AgreementActions;

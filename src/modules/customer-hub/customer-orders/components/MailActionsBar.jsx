import React from "react"
import { Eye, EyeOff, Package, Sparkles } from "lucide-react"

const MailActionsBar = ({ showEmail, onToggleEmail, onOpenCosting }) => {
  return (
    <div className="sticky top-0 z-10 -mx-6 px-6 py-3 bg-gradient-to-r from-primary/10 via-transparent to-emerald-100/20 dark:from-primary/10 dark:to-white/5 backdrop-blur border-b dark:border-defaultborder/20">
      <div className="flex flex-wrap items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10">
          <Sparkles size={16} />
          <span className="text-[.8rem] font-medium">Smart View</span>
        </div>
        <button onClick={onToggleEmail} className="ti-btn ti-btn-primary !mb-0 inline-flex items-center gap-2">
          {showEmail ? <EyeOff size={16} /> : <Eye size={16} />}
          {showEmail ? "Hide Email Body" : "View Original Email"}
        </button>
        <button onClick={onOpenCosting} className="ti-btn ti-btn-success !mb-0 inline-flex items-center gap-2">
          <Package size={16} />
          Airjet Costing
        </button>
      </div>
    </div>
  )
}

export default MailActionsBar

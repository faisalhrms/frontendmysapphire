import React, { useState } from "react"
import { Mail, Globe, FileSpreadsheet } from "lucide-react"
import ApiChannelsTab from "@modules/customer-hub/integrations/components/ApiChannelsTab.jsx"
import ExcelUploadTab from "@modules/customer-hub/integrations/components/ExcelUploadTab.jsx"
import CustomerHubEmailList from "@modules/customer-hub/mail-settings/views/CustomerHubEmailList.jsx";

const TabBtn = ({ active, onClick, Icon, label, iconClass = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${
      active ? "bg-primary/10 text-primary border-primary/30" : "bg-transparent text-slate-600 dark:text-white/70 border-slate-200/60 dark:border-white/10"
    }`}
  >
    <Icon size={16} className={iconClass} />
    <span>{label}</span>
  </button>
)

const IntegrationsTabs = () => {
  const [tab, setTab] = useState("email")
  return (
    <div className="p-3">
      <div className="box mb-4">
        <div className="box-body">
          <div className="flex gap-4">
            <TabBtn active={tab==="email"} onClick={()=>setTab("email")} Icon={Mail} label="Email" iconClass="text-sky-500" />
            <TabBtn active={tab==="api"} onClick={()=>setTab("api")} Icon={Globe} label="API" iconClass="text-violet-500" />
            <TabBtn active={tab==="excel"} onClick={()=>setTab("excel")} Icon={FileSpreadsheet} label="Excel" iconClass="text-emerald-500" />
          </div>
        </div>
      </div>
      {tab==="email" && <CustomerHubEmailList />}
      {tab==="api" && <ApiChannelsTab />}
      {tab==="excel" && <ExcelUploadTab />}
    </div>
  )
}

export default IntegrationsTabs

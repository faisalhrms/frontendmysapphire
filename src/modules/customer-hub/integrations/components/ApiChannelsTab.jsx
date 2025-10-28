import React, { useEffect, useState } from "react"
import { Globe, Wifi, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import AddChannelCard from "@modules/customer-hub/integrations/components/AddChannelCard.jsx"
import { listChannels, testChannel } from "@modules/customer-hub/integrations/services/IntegrationsService.js"
import { useIntegrations } from "@modules/customer-hub/integrations/hooks/useIntegrations.js"

const StatusPill = ({ ok, status, latency }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
    {ok ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
    <span>{ok ? "OK" : "Fail"}</span>
    {typeof status==="number" && <span>• {status}</span>}
    {typeof latency==="number" && <span>• {latency}ms</span>}
  </span>
)

const ApiChannelsTab = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [probe, setProbe] = useState({})
  const { newChannel, setNewChannel, headersText, setHeadersText, onTypeChange, saveNew } = useIntegrations()

  const load = async () => {
    setLoading(true)
    const r = await listChannels({ type: "api" })
    setRows(Array.isArray(r) ? r : [])
    setLoading(false)
  }

  const runTest = async (id) => {
    setProbe(s=>({ ...s, [id]: { testing: true } }))
    const res = await testChannel(id)
    setProbe(s=>({ ...s, [id]: { testing: false, ...res } }))
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="xl:col-span-8 col-span-12">
        <div className="box">
          <div className="box-header">
            <div className="box-title">API Channels</div>
            <button onClick={load} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem]"><RefreshCw size={14}/></button>
          </div>
          <div className="box-body overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Auth</th>
                  <th className="py-2 px-3">Base URL</th>
                  <th className="py-2 px-3">Active</th>
                  <th className="py-2 px-3">Test</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r=>(
                  <tr key={r.id} className="border-b">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <Globe size={16} />
                        <div className="font-medium">{r.name}</div>
                      </div>
                    </td>
                    <td className="py-2 px-3 capitalize">{r.auth_type}</td>
                    <td className="py-2 px-3 truncate max-w-[22rem]">{r.base_url || "-"}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${r.active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>{r.active ? "Active" : "Inactive"}</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>runTest(r.id)} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem]" disabled={probe[r.id]?.testing}>
                          <Wifi size={14}/>
                        </button>
                        {probe[r.id] && !probe[r.id].testing && <StatusPill ok={probe[r.id]?.ok} status={probe[r.id]?.status} latency={probe[r.id]?.latency_ms} />}
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length===0 && !loading && (
                  <tr>
                    <td colSpan={5} className="py-6 px-3 text-center opacity-70">No API channels</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 col-span-12">
        <AddChannelCard
          newChannel={newChannel}
          setNewChannel={setNewChannel}
          headersText={headersText}
          setHeadersText={setHeadersText}
          onTypeChange={onTypeChange}
          saveNew={async ()=>{
            await saveNew()
            await load()
          }}
        />
      </div>
    </div>
  )
}

export default ApiChannelsTab

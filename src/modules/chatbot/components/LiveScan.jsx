import React, { useEffect, useRef, useState } from "react"
import api from "@config/axiosConfig.js"
import store from "@redux/store.jsx"
import TypingIndicator from "@modules/chatbot/components/TypingIndicator.jsx"

const abs = (path) => {
  const base = (api.defaults.baseURL || "").replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}
const authHeaders = () => {
  const token = store.getState()?.auth?.tokens?.access_token
  const h = {}
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

export default function LiveScanLCD({ url, shots = 2, delayMs = 1800, maxWidth = 600 }) {
  const [srcUrl, setSrcUrl] = useState("")
  const urlRef = useRef(url)
  useEffect(() => { urlRef.current = url }, [url])
  useEffect(() => {
    let active = true
    let blobUrl = ""
    let taken = 0
    const take = async () => {
      if (!active || taken >= Math.max(1, Math.min(3, Number(shots) || 2))) return
      try {
        const u = `${abs("chat/query/qc/screenshot/")}?url=${encodeURIComponent(urlRef.current)}&t=${Date.now()}`
        const res = await fetch(u, { headers: authHeaders(), credentials: "include" })
        if (!res.ok) return
        const blob = await res.blob()
        if (!active) return
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        blobUrl = URL.createObjectURL(blob)
        setSrcUrl(blobUrl)
      } catch {}
      taken += 1
      if (taken < Math.max(1, Math.min(3, Number(shots) || 2))) {
        setTimeout(take, Math.max(1000, Number(delayMs) || 1800))
      }
    }
    take()
    return () => {
      active = false
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [shots, delayMs])
  return (
    <div className="lcd-wrap" style={{ "--lcd-max-w": `${maxWidth}px` }}>
      <div className="lcd-screen">
        {srcUrl ? <img src={srcUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" /> : null}
        <div className="scan-overlay" />
        <div className="lcd-hud">
          <span className="hud-text">Scanning</span>
          <TypingIndicator />
        </div>
      </div>
      <div className="lcd-footer">{url}</div>
      <style>{`
        .lcd-wrap{width:100%;max-width:var(--lcd-max-w);margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,.08);background:#0b1020}
        .lcd-screen{position:relative;height:15rem;background:radial-gradient(ellipse at center, #0c142a 0%, #090e1e 60%, #070a16 100%);box-shadow:inset 0 0 80px rgba(0,255,180,.06)}
        .scan-overlay{pointer-events:none;position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,255,150,0) 0%, rgba(0,255,150,.18) 50%, rgba(0,255,150,0) 100%);mix-blend-mode:screen;animation:scanMove 2.4s linear infinite}
        .lcd-hud{position:absolute;top:.5rem;left:.5rem;display:flex;align-items:center;gap:.5rem;background:rgba(15,25,40,.6);backdrop-filter:blur(6px);border:1px solid rgba(0,255,150,.2);border-radius:999px;padding:.25rem .6rem;color:#9fffe0;font-size:.75rem}
        .lcd-footer{padding:.35rem .6rem;font-size:.7rem;color:#88a;letter-spacing:.2px;background:linear-gradient(90deg,#0b1020,#0e162e)}
        @keyframes scanMove {0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
      `}</style>
    </div>
  )
}

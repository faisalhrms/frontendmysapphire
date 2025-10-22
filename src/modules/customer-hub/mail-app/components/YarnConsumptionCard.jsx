import React, { useEffect, useMemo, useState } from "react"

const Row = ({ label, value, last }) => (
  <div className={`${last ? "" : "border-b dark:border-defaultborder/20"} grid grid-cols-2 items-center`}>
    <div className="py-2 pr-3 text-[.8rem] text-[#6b7280] dark:text-white/60">{label}</div>
    <div className="py-2 pl-3 text-right text-[.95rem] font-semibold">{value ?? "-"}</div>
  </div>
)

const Stat = ({ label, value, suffix }) => (
  <div className="rounded-lg border p-3 shadow-sm bg-white dark:bg-bodybg dark:border-defaultborder/20">
    <div className="text-[.72rem] text-[#6b7280] dark:text-white/60">{label}</div>
    <div className="mt-1 text-[1rem] font-semibold">{value}</div>
    {suffix ? <div className="text-[.65rem] opacity-60">{suffix}</div> : null}
  </div>
)

const RejectionBox = ({ value, onChange }) => (
  <div className="rounded-lg border p-3 shadow-sm bg-white dark:bg-bodybg dark:border-defaultborder/20">
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-[.72rem] text-[#6b7280] dark:text-white/60">Rejection</div>
        <div className="text-[1rem] font-semibold">{value}%</div>
      </div>
      <input type="number" min={0} max={50} value={value} onChange={(e) => onChange(Number(e.target.value || 0))} className="form-control !h-9 !py-2 !px-2 w-20 text-sm" placeholder="0" />
    </div>
  </div>
)

const toNum = (v) => {
  if (v == null) return 0
  if (typeof v === "number") return v
  const m = String(v).match(/-?\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : 0
}

const round = (n, d = 2) => Number((isFinite(n) ? n : 0).toFixed(d))

const YarnConsumptionCard = ({ item, totalMeters, onTotalMetersChange, widthInches, widthCm, onComputed }) => {
  const [meters, setMeters] = useState(totalMeters || "")
  const [rejPct, setRejPct] = useState(10)
  useEffect(() => { setMeters(totalMeters || "") }, [totalMeters])

  const epi = toNum(item?.ends)
  const ppi = toNum(item?.picks)
  const warpCount = toNum(item?.warp_count)
  const weftCount = toNum(item?.weft_count)

  const widthIn = useMemo(() => {
    const wIn = toNum(widthInches)
    if (wIn) return wIn
    const wCm = toNum(widthCm)
    if (wCm) return wCm / 2.54
    const finIn = toNum(item?.finished_width_inches)
    if (finIn) return finIn
    const finCm = toNum(item?.finished_width_cm)
    if (finCm) return finCm / 2.54
    const gw = item?.greige_width || ""
    const n = toNum(gw)
    if (n) return /cm/i.test(gw) ? n / 2.54 : n
    return 0
  }, [widthInches, widthCm, item])

  const widthDisplay = useMemo(() => {
    if (toNum(widthInches)) return String(widthInches)
    if (toNum(widthCm)) return String(widthCm)
    const gw = (item?.greige_width || "").trim()
    if (gw) return gw
    if (item?.finished_width_cm) return String(item.finished_width_cm)
    if (item?.finished_width_inches) return String(item.finished_width_inches)
    return ""
  }, [widthInches, widthCm, item])

  const yardsPerMeter = 1.0936
  const warpReq = useMemo(() => {
    const m = toNum(meters)
    if (!m || !epi || !widthIn || !warpCount) return 0
    return round(((epi * yardsPerMeter * widthIn * m) / (840 * warpCount)) / 100, 2)
  }, [epi, widthIn, meters, warpCount])

  const weftReq = useMemo(() => {
    const m = toNum(meters)
    if (!m || !ppi || !widthIn || !weftCount) return 0
    return round(((ppi * yardsPerMeter * widthIn * m) / (840 * weftCount)) / 100, 2)
  }, [ppi, widthIn, meters, weftCount])

  const totalReq = useMemo(() => round(warpReq + weftReq, 2), [warpReq, weftReq])
  const gsm = useMemo(() => (!warpCount || !weftCount ? 0 : round(((epi / warpCount) + (ppi / weftCount)) * 24.6, 0)), [epi, ppi, warpCount, weftCount])
  const coverFactor = useMemo(() => (!warpCount || !weftCount ? 0 : round(epi / Math.sqrt(warpCount) + ppi / Math.sqrt(weftCount), 1)), [epi, ppi, warpCount, weftCount])
  const warpWithRej = useMemo(() => round(warpReq * (1 + rejPct / 100), 2), [warpReq, rejPct])
  const weftWithRej = useMemo(() => round(weftReq * (1 + rejPct / 100), 2), [weftReq, rejPct])
  const totalWithRej = useMemo(() => round(warpWithRej + weftWithRej, 2), [warpWithRej, weftWithRej])

  useEffect(() => {
    onComputed && onComputed({ warpReq, weftReq, warpWithRej, weftWithRej, totalWithRej, rejPct, widthIn })
  }, [warpReq, weftReq, warpWithRej, weftWithRej, totalWithRej, rejPct, widthIn, onComputed])

  return (
    <div className="rounded-2xl border bg-white shadow-md dark:bg-bodybg dark:border-defaultborder/20">
      <div className="p-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border overflow-hidden shadow-sm bg-white dark:bg-bodybg dark:border-defaultborder/20">
          <div className="px-4 py-2 border-b dark:border-defaultborder/20">
            <div className="text-[.75rem] uppercase tracking-wide text-[#6b7280] dark:text-white/60">Parameters</div>
          </div>
          <div className="px-4">
            <Row label="Warp count" value={item?.warp_count} />
            <Row label="Weft Count" value={item?.weft_count} />
            <Row label="Warp density" value={item?.ends} />
            <Row label="Weft Density" value={item?.picks} />
            <Row label="Width" value={widthDisplay} last />
          </div>
          <div className="px-4 py-3 border-t dark:border-defaultborder/20">
            <div className="text-[.75rem] text-[#6b7280] dark:text-white/60 mb-1">Total Meter to be placed</div>
            <input type="number" min={0} value={meters} onChange={(e) => { const v = e.target.value; setMeters(v); onTotalMetersChange && onTotalMetersChange(v) }} className="form-control !h-10 !py-2.5 !px-3 text-[.92rem]" placeholder="0" />
          </div>
        </div>

        <div className="lg:col-span-5 grid gap-3 content-start">
          <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-bodybg dark:border-defaultborder/20">
            <div className="text-[.75rem] uppercase tracking-wide text-[#6b7280] dark:text-white/60 mb-3">Bags</div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Warp yarn required" value={warpReq} suffix="BAGS" />
              <Stat label="Weft yarn required" value={weftReq} suffix="BAGS" />
              <Stat label="Total" value={totalReq} />
              <RejectionBox value={rejPct} onChange={setRejPct} />
              <Stat label="With rej (warp)" value={warpWithRej} suffix="BAGS" />
              <Stat label="With rej (weft)" value={weftWithRej} suffix="BAGS" />
              <div className="col-span-2 rounded-xl px-4 py-3 flex items-center justify-between border shadow-sm bg-white dark:bg-bodybg dark:border-defaultborder/20">
                <div className="text-[.95rem] font-medium">Total Bags</div>
                <div className="text-[1.15rem] font-semibold">{totalWithRej}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="GSM" value={gsm} />
            <Stat label="Cover Factor" value={coverFactor} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default YarnConsumptionCard

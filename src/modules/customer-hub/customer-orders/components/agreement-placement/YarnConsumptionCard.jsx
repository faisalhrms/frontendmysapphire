import React, { useEffect, useMemo, useRef, useState } from "react"

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
      <input
        type="number"
        min={0}
        max={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="form-control !h-9 !py-2 !px-2 w-20 text-sm"
        placeholder="0"
      />
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

const YarnConsumptionCard = ({ item, totalMeters, onTotalMetersChange, onComputed, dyeingMeta }) => {
  const [meters, setMeters] = useState(totalMeters || "")
  const [rejPct, setRejPct] = useState(10)
  const onComputedRef = useRef(onComputed)
  const prevPayloadRef = useRef(null)

  useEffect(() => {
    onComputedRef.current = onComputed
  }, [onComputed])

  useEffect(() => {
    setMeters(totalMeters || "")
  }, [totalMeters])

  const epi = toNum(item?.ends)
  const ppi = toNum(item?.picks)
  const warpCount = toNum(item?.warp_count)
  const weftCount = toNum(item?.weft_count)

  const widthIn = useMemo(
    () =>
      toNum(
        item?.greige_width ??
          item?.finished_width_inches ??
          item?.fabric_width_inches ??
          item?.width
      ),
    [item?.greige_width, item?.finished_width_inches, item?.fabric_width_inches, item?.width]
  )

  const widthDisplay = widthIn || ""

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

  const gsm = useMemo(() => {
    if (!warpCount || !weftCount) return 0
    return round(((epi / warpCount) + (ppi / weftCount)) * 24.6, 0)
  }, [epi, ppi, warpCount, weftCount])

  const coverFactor = useMemo(() => {
    if (!warpCount || !weftCount) return 0
    return round(epi / Math.sqrt(warpCount) + ppi / Math.sqrt(weftCount), 1)
  }, [epi, ppi, warpCount, weftCount])

  const warpWithRej = useMemo(
    () => round(warpReq * (1 + rejPct / 100), 2),
    [warpReq, rejPct]
  )

  const weftWithRej = useMemo(
    () => round(weftReq * (1 + rejPct / 100), 2),
    [weftReq, rejPct]
  )

  const totalWithRej = useMemo(
    () => round(warpWithRej + weftWithRej, 2),
    [warpWithRej, weftWithRej]
  )

  const warpCoveragePct = useMemo(
    () => toNum(dyeingMeta?.warp_coverage),
    [dyeingMeta?.warp_coverage]
  )

  const weftCoveragePct = useMemo(
    () => toNum(dyeingMeta?.weft_coverage),
    [dyeingMeta?.weft_coverage]
  )

  const warpCoverageFrac = warpCoveragePct ? warpCoveragePct / 100 : 0
  const weftCoverageFrac = weftCoveragePct ? weftCoveragePct / 100 : 0

  const warpDyedBags = useMemo(
    () => round(warpWithRej * warpCoverageFrac, 2),
    [warpWithRej, warpCoverageFrac]
  )

  const weftDyedBags = useMemo(
    () => round(weftWithRej * weftCoverageFrac, 2),
    [weftWithRej, weftCoverageFrac]
  )

  const warpEcruBags = useMemo(
    () => round(warpWithRej - warpDyedBags, 2),
    [warpWithRej, warpDyedBags]
  )

  const weftEcruBags = useMemo(
    () => round(weftWithRej - weftDyedBags, 2),
    [weftWithRej, weftDyedBags]
  )

  const totalDyedBags = useMemo(
    () => round(warpDyedBags + weftDyedBags, 2),
    [warpDyedBags, weftDyedBags]
  )

  const totalEcruBags = useMemo(
    () => round(warpEcruBags + weftEcruBags, 2),
    [warpEcruBags, weftEcruBags]
  )

  useEffect(() => {
    const payload = {
      warp_yarn_required: warpReq,
      weft_yarn_required: weftReq,
      warp_bags: warpWithRej,
      weft_bags: weftWithRej,
      total_bags: totalWithRej,
      rej_pct: rejPct,
      width_inch: widthIn,
      warp_coverage: warpCoveragePct,
      weft_coverage: weftCoveragePct,
      dyed_warp_bags: warpDyedBags,
      dyed_weft_bags: weftDyedBags,
      ecru_warp_bags: warpEcruBags,
      ecru_weft_bags: weftEcruBags,
      dyed_bags: totalDyedBags,
      ecru_bags: totalEcruBags
    }
    const same = JSON.stringify(prevPayloadRef.current) === JSON.stringify(payload)
    if (!same) {
      prevPayloadRef.current = payload
      if (onComputedRef.current) onComputedRef.current(payload)
    }
  }, [
    warpReq,
    weftReq,
    warpWithRej,
    weftWithRej,
    totalWithRej,
    rejPct,
    widthIn,
    warpCoveragePct,
    weftCoveragePct,
    warpDyedBags,
    weftDyedBags,
    warpEcruBags,
    weftEcruBags,
    totalDyedBags,
    totalEcruBags
  ])

  return (
    <div className="rounded-2xl border bg-white shadow-md dark:bg-bodybg dark:border-defaultborder/20">
      <div className="p-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5 rounded-xl border overflow-hidden shadow-sm bg-white dark:bg-bodybg dark:border-defaultborder/20">
          <div className="px-4 py-2 border-b dark:border-defaultborder/20">
            <div className="text-[.75rem] uppercase tracking-wide text-[#6b7280] dark:text-white/60">
              Parameters
            </div>
          </div>
          <div className="px-4">
            <Row label="Warp count" value={item?.warp_count} />
            <Row label="Weft Count" value={item?.weft_count} />
            <Row label="Warp density" value={item?.ends} />
            <Row label="Weft Density" value={item?.picks} />
            <Row label="Width" value={widthDisplay} last />
          </div>
          <div className="px-4 py-3 border-t dark:border-defaultborder/20">
            <div className="text-[.75rem] text-[#6b7280] dark:text-white/60 mb-1">
              Total Meter to be placed
            </div>
            <input
              type="number"
              min={0}
              value={meters}
              onChange={(e) => {
                const v = e.target.value
                setMeters(v)
                if (onTotalMetersChange) onTotalMetersChange(v)
              }}
              className="form-control !h-10 !py-2.5 !px-3 text-[.92rem]"
              placeholder="0"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-bodybg dark:border-defaultborder/20">
            <div className="text-[.75rem] uppercase tracking-wide text-[#6b7280] dark:text-white/60 mb-3">
              Bags & Dyeing Summary
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              <Stat label="Warp yarn required" value={warpReq} suffix="BAGS" />
              <Stat label="Weft yarn required" value={weftReq} suffix="BAGS" />
              <Stat label="Total yarn" value={totalReq} suffix="BAGS" />

              <RejectionBox value={rejPct} onChange={setRejPct} />

              <Stat label="GSM" value={gsm} />
              <Stat label="Cover Factor" value={coverFactor} />
              <div className="col-span-2 xl:col-span-3 rounded-lg border p-3 flex items-center justify-between shadow-sm bg-white dark:bg-bodybg dark:border-defaultborder/20">
                <div className="text-[.8rem] text-[#6b7280] dark:text-white/60">Total Bags</div>
                <div className="text-[1.15rem] font-semibold">{totalWithRej}</div>
              </div>

              <Stat label="Warp coverage" value={`${round(warpCoveragePct, 2)}%`} />
              <Stat label="Weft coverage" value={`${round(weftCoveragePct, 2)}%`} />
              <Stat label="Total dyed" value={totalDyedBags} />

              <Stat label="Warp bags ecru" value={warpEcruBags} />
              <Stat label="Weft bags ecru" value={weftEcruBags} />
              <Stat label="Total ecru" value={totalEcruBags} />

              <Stat label="Warp bags dyed" value={warpDyedBags} />
              <Stat label="Weft bags dyed" value={weftDyedBags} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YarnConsumptionCard

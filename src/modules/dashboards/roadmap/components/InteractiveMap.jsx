import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react"
import CertificateCanvas from "./CertificateCanvas.jsx"
import { differenceInCalendarDays, parseISO } from "date-fns"

const iconImg = (src, alt) => <img src={src} alt={alt} className="w-8 h-8"/>
const iconMap = {
  Fiber: iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751622582/fiber_svg_zawcar.svg","Fiber"),
  Spinning: iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751622649/spinning_svg_ctprca.svg","Spinning"),
  "Yarn Dyeing": iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751624020/yarn_dyeing_svg_hcjmi8.svg","Yarn Dyeing"),
  Weaving: iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751623481/weaving_svg_bwdrg1.svg","Weaving"),
  Processing: iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751622978/processing_svg_ctwovk.svg","Processing"),
  Wadding: iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751623012/wadding_svg_yvu1q1.svg","Wadding"),
  Stitching: iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751623689/stitching_svg_b4zb8r.svg","Stitching"),
  Accessories: iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751622705/accessories_svg_p011ii.svg","Accessories"),
  Packaging: iconImg("https://res.cloudinary.com/dtsguaevl/image/upload/v1751622788/packaging_svg_iegi0r.svg","Packaging")
}

export default function InteractiveMap({ chain }) {
  const [animationOffset, setAnimationOffset] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setAnimationOffset(p => (p + 1) % 100), 100)
    return () => clearInterval(iv)
  }, [])

  const cleanName = s => (s || "").replace(/\s*\((Inhouse|Outsource)\)$/i, "")

  const data = chain?.data || chain || {}
  const cats = data.unit_categories || []
  const sec = data.sections || {}
  const raw = sec.raw_materials || []
  const units = sec.units || []
  const acc = sec.accessories || []
  const pkg = sec.packaging || []
  const rowsByCat = useMemo(() => {
    const o = {}
    ;[...raw, ...units, ...acc, ...pkg].forEach(r => {
      const cid = r.category_id
      if (!o[cid]) o[cid] = []
      o[cid].push(r)
    })
    return o
  }, [raw, units, acc, pkg])

  const grouped = useMemo(() => {
    const g = {}
    Object.entries(rowsByCat).forEach(([cid, rows]) => {
      const m = {}
      rows.forEach(r => {
        const uid = r.unit?.id
        if (!uid) return
        if (!m[uid]) {
          m[uid] = {
            unitId: uid,
            unitName: cleanName(r.unit?.name || ""),
            suppliers: [],
            inHouse: !!r.is_in_house
          }
        } else if (r.is_in_house) {
          m[uid].inHouse = true
        }
        ;(r.suppliers || []).forEach(s => {
          if (!m[uid].suppliers.find(x => x.id === s.id)) {
            m[uid].suppliers.push(s)
          }
        })
      })
      g[cid] = Object.values(m)
    })
    return g
  }, [rowsByCat])

  const basePoints = [
    { id: "fiber", name: "Fiber", x: 170, y: 400 },
    { id: "spinning", name: "Spinning", x: 350, y: 180 },
    { id: "yarn-dyeing", name: "Yarn Dyeing", x: 640, y: 180 },
    { id: "weaving", name: "Weaving", x: 899, y: 180 },
    { id: "processing", name: "Processing", x: 1140, y: 305 },
    { id: "wadding", name: "Wadding", x: 1009, y: 400 },
    { id: "stitching", name: "Stitching", x: 830, y: 400 },
    { id: "accessories", name: "Accessories", x: 556, y: 400 },
    { id: "packaging", name: "Packaging", x: 300, y: 400 }
  ]
  const points = basePoints
    .map(p => {
      const catObj = cats.find(c => c.name.toLowerCase() === p.name.toLowerCase())
      const cid = catObj?.id
      return { ...p, cid, icon: iconMap[p.name], units: grouped[cid] || [] }
    })
    .filter(p => p.units.length > 0)

  const positions = {
    fiber: { left: -30, top: 170 },
    spinning: { left: 250, top: -80 },
    "yarn-dyeing": { left: 540, top: 50 },
    weaving: { left: 799, top: 30 },
    processing: { left: 1050, top: 290 },
    wadding: { left: 909, top: 530 },
    stitching: { left: 650, top: 530 },
    accessories: { left: 370, top: 530 },
    packaging: { left: 100, top: 530 }
  }
  const markers = {
    fiber: { x: 70, y: 335 },
    spinning: { x: 350, y: 75 },
    "yarn-dyeing": { x: 640, y: 190 },
    weaving: { x: 899, y: 190 },
    processing: { x: 1000, y: 320 },
    wadding: { x: 1000, y: 455 },
    stitching: { x: 750, y: 460 },
    accessories: { x: 470, y: 460 },
    packaging: { x: 200, y: 460 }
  }

  const [expanded, setExpanded] = useState({})
  const toggle = (cid, uid) =>
    setExpanded(e => ({ ...e, [`${cid}:${uid}`]: !e[`${cid}:${uid}`] }))
  const [canvasData, setCanvasData] = useState({ unitName: "", groups: {} })

  const openCanvas = (cid, uid, unitName) => {
    const rows = rowsByCat[cid] || []
    const row = rows.find(r => r.unit.id === uid) || {}
    const certs = row.certificates || []
    const groups = certs.reduce((acc, c) => {
      const type = c.certificate.certificate_type.name.toUpperCase()
      if (!acc[type]) acc[type] = []
      acc[type].push(c)
      return acc
    }, {})
    setCanvasData({ unitName: cleanName(unitName), groups })
    const el = document.getElementById("hs-overlay-right")
    if (el) window.HSOverlay.open(el)
  }

  const wrapperRef = useRef(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width } = entry.contentRect
      setScale(Math.min(width / 1400, 1))
    })
    if (wrapperRef.current) obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  if (!points.length) return null

  return (
    <div ref={wrapperRef} className="w-full overflow-auto pt-24">
      <div
        className="relative"
        style={{
          width: 1400,
          height: 720,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          left: "60px"
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
          <defs>
            <pattern id="asphaltPattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill="#1a1c1e" />
              <circle cx="2" cy="2" r="0.75" fill="#2f3133" />
              <circle cx="6" cy="6" r="0.75" fill="#2f3133" />
            </pattern>
          </defs>
          <path
            d="M-500 300 L-5 300 L-5 80 L220 80 L220 180 L650 180 L650 399 L450 399 L450 320 L310 320 L310 400 L-190 400"
            stroke="url(#asphaltPattern)"
            strokeWidth="48"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M-500 300 L-5 300 L-5 80 L220 80 L220 180 L650 180 L650 399 L450 399 L450 320 L310 320 L310 400 L-190 400"
            stroke="#e8e8e8"
            strokeWidth="3"
            fill="none"
            strokeDasharray="30,20"
            strokeDashoffset={-animationOffset}
            strokeLinecap="round"
          />
        </svg>
        <svg className="absolute inset-0 pointer-events-none" width="1400" height="720">
          {points.map(p => {
            const hasOut = p.units.some(u => !u.inHouse)
            const icon = hasOut
              ? "https://res.cloudinary.com/dtsguaevl/image/upload/v1751621545/red_location_icon_svg_hfnkfi.svg"
              : "https://res.cloudinary.com/dtsguaevl/image/upload/v1751621408/blue_location_icon_svg_itujxr.svg"
            const m = markers[p.id]
            return <image key={p.id} href={icon} x={m.x - 12} y={m.y - 16} width="40" height="40" />
          })}
        </svg>

        {points.map(p => {
          const pos = positions[p.id]
          const hasIn = p.units.some(u => u.inHouse)
          const hasOut = p.units.some(u => !u.inHouse)
          const headerClass = hasIn && hasOut ? "" : hasOut ? "!bg-pink/20" : "bg-info/15"
          const headerStyle =
            hasIn && hasOut
              ? { background: "linear-gradient(90deg, rgba(236,72,153,0.2) 0%, rgba(236,72,153,0.2) 50%, rgba(59,130,246,0.15) 50%, rgba(59,130,246,0.15) 100%)" }
              : undefined
          return (
            <div
              key={p.id}
              className="absolute w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              style={{ left: pos.left, top: pos.top }}
            >
              <div className={`flex items-center gap-6 p-1 ${headerClass}`} style={headerStyle}>
                <div className="p-1">{p.icon}</div>
                <span className="font-bold text-gray-800 dark:text-gray-200 truncate">
                  {p.name}
                </span>
              </div>
              <div className="p-3">
                <ul className="space-y-2">
                  {p.units.map(u => {
                    const key = `${p.cid}:${u.unitId}`
                    const showToggle = u.suppliers.length > 0
                    return (
                      <li key={u.unitId}>
                        <div className="flex justify-between items-center">
                          <span
                            className="text-xs text-gray-800 font-medium dark:text-gray-200 cursor-pointer"
                            onClick={() => openCanvas(p.cid, u.unitId, u.unitName)}
                          >
                            {u.unitName}
                          </span>
                          {showToggle && (
                            <span
                              className="text-sky-700 font-bold text-lg cursor-pointer"
                              onClick={() => toggle(p.cid, u.unitId)}
                            >
                              {expanded[key] ? "−" : "+"}
                            </span>
                          )}
                        </div>
                        {expanded[key] && showToggle && (
                          <div className="table-responsive max-h-32 overflow-hidden">
                            <table className="table  table-hover whitespace-nowrap min-w-full">
                              <tbody>
                                {u.suppliers.map(s => (
                                  <tr
                                    key={s.id}
                                    className="border-t border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10 cursor-pointer"
                                    onClick={() =>
                                      openCanvas(p.cid, u.unitId, u.unitName)
                                    }
                                  >
                                    <td className="!text-xs !font-normal">{s.name}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
      <CertificateCanvas
        id="hs-overlay-right"
        unitName={canvasData.unitName}
        groups={canvasData.groups}
      />
    </div>
  )
}

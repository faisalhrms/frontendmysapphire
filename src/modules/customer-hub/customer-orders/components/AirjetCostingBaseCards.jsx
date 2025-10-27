import React, { useEffect, useMemo, useState } from "react"
import {
  Hash, BadgeCheck, Tag, Palette, Gauge, Wind, Layers, Cog, Droplets,
  Calculator, DollarSign, Truck, Percent, TrendingUp, ClipboardList
} from "lucide-react"
import NumWidthStat from "@modules/customer-hub/customer-orders/components/NumWidthStat.jsx"
import EditableKV from "@modules/customer-hub/customer-orders/components/EditableKV.jsx"
import ComputedKV from "@modules/customer-hub/customer-orders/components/ComputedKV.jsx"

const KV = ({ k, v }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-gray-600 dark:text-white/70 truncate">{k}</span>
    <span className="font-medium">{v ?? "-"}</span>
  </div>
)

const TitleWithIcon = ({ Icon, title, color = "slate" }) => {
  const map = {
    slate: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80 border-slate-200/80",
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200/80",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200/80",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/80",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200/80",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200/80",
    cyan: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200/80",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200/80",
    fuchsia: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 border-fuchsia-200/80",
    teal: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/80",
    blue: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200/80",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/80",
  }
  const chip = map[color] || map.slate
  return (
    <div className="flex items-center gap-3 mb-3">
      {Icon ? (
        <span className={`h-9 w-9 grid place-items-center rounded-lg border ${chip}`}>
          <Icon size={18} />
        </span>
      ) : null}
      <div className="text-[.95rem] font-semibold">{title}</div>
    </div>
  )
}

const Card = ({ title, Icon, headerColor = "slate", children, dense, className = "" }) => (
  <div className={`h-full min-w-0 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#121212] shadow-md ${className}`}>
    <div className={`${dense ? "p-3" : "p-4"} h-full flex flex-col`}>
      {title ? <TitleWithIcon Icon={Icon} title={title} color={headerColor} /> : null}
      <div className="space-y-1.5 flex-1">{children}</div>
    </div>
  </div>
)

const Chip = ({ children, className }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[.75rem] font-semibold border ${className}`}>{children}</span>
)

const StatShell = ({ children, ring }) => (
  <div className={`rounded-lg px-4 py-3 text-center border ${ring ? ring : "border-slate-200/80"} bg-white dark:bg-[#151515]`}>
    {children}
  </div>
)

const Stat = ({ label, value, ring }) => (
  <StatShell ring={ring}>
    <div className="text-[.75rem] text-gray-600 dark:text-white/70">{label}</div>
    <div className="mt-0.5 text-[1.05rem] font-semibold">{value ?? "-"}</div>
  </StatShell>
)

const HeaderCard = ({ data }) => (
  <div className="rounded-full border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#111] shadow-md p-2 flex flex-wrap items-center justify-between gap-3 overflow-x-hidden">
    <div className="flex items-center gap-4">
      <div className="h-7 w-7 rounded-md grid place-items-center bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
        <Hash size={15} className="text-sky-800" />
      </div>
      <div>
        <div className="text-[.75rem] text-gray-600 dark:text-white/70">Item Code</div>
        <div className="text-[0.9rem] font-extrabold tracking-wide">{data.item_code || "-"}</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Chip className="border-emerald-200/80 text-emerald-700 dark:text-emerald-300"><BadgeCheck size={14} />Quality: {data.quality_code || "-"}</Chip>
      {data.process_type ? <Chip className="border-sky-200/80 text-sky-700 dark:text-sky-300"><Droplets size={14} />Type: {data.process_type}</Chip> : null}
      {data.design ? <Chip className="border-fuchsia-200/80 text-fuchsia-700 dark:text-fuchsia-300"><Tag size={14} />Design: {data.design}</Chip> : null}
      {data.color ? <Chip className="border-amber-200/80 text-amber-700 dark:text-amber-300"><Palette size={14} />Color: {data.color}</Chip> : null}
    </div>
  </div>
)

const TwoCol = ({ children }) => <div className="grid gap-3 md:grid-cols-2 items-stretch">{children}</div>

const LBS_PER_KG = 2.2046
const toNum = (x) => {
  const n = Number(x)
  return Number.isFinite(n) ? n : NaN
}

const AirjetCostingBaseCards = ({ data, onChangeCosts }) => {
  if (!data) return null

  const fabricInches = useMemo(() => {
    if (data.fabric_width_inches) return data.fabric_width_inches
    if (typeof data.greige_width === "string") {
      const n = parseFloat((data.greige_width || "").replace(/[^0-9.]/g, ""))
      return Number.isFinite(n) ? n : undefined
    }
    return undefined
  }, [data.fabric_width_inches, data.greige_width])

    const LBS_PER_KG = 2.2046
    const toNum = (x, fb = NaN) => {
      const n = Number(x)
      return Number.isFinite(n) ? n : fb
    }

    const yarnCostCompute = useMemo(() => {
        return () => {
            const warpCons = toNum(data.warp_cons_per_yard, NaN)
            const weftCons = toNum(data.weft_cons_per_yard, NaN)
            if (Number.isNaN(warpCons) || Number.isNaN(weftCons)) return null
            const warpCost10 = toNum(data.warp_cost_per_10lbs, 0)
            const weftCost10 = toNum(data.weft_cost_per_10lbs, 0)
            const dyeWarpPerKg = toNum(data.dyeing_charges_perkg_warp, 0)
            const dyeWeftPerKg = toNum(data.dyeing_charges_perkg_weft, 0)
            const covWarp = toNum(data.color_coverage_warp_percent, 0)
            const covWeft = toNum(data.color_coverage_weft_percent, 0)
            const warpTerm = covWarp === 100 ? (dyeWarpPerKg / LBS_PER_KG) * 10 + warpCost10 : (covWarp / 100) * (dyeWarpPerKg / LBS_PER_KG) * 10 + warpCost10
            const weftTerm = covWeft === 100 ? (dyeWeftPerKg / LBS_PER_KG) * 10 + weftCost10 : (covWeft / 100) * (dyeWeftPerKg / LBS_PER_KG) * 10 + weftCost10
            const total = warpTerm * (warpCons / 10) + weftTerm * (weftCons / 10)
            return Math.round((total + Number.EPSILON) * 100) / 100
        }
    }, [
        data.warp_cons_per_yard,
        data.weft_cons_per_yard,
        data.warp_cost_per_10lbs,
        data.weft_cost_per_10lbs,
        data.dyeing_charges_perkg_warp,
        data.dyeing_charges_perkg_weft,
        data.color_coverage_warp_percent,
        data.color_coverage_weft_percent,
    ])

    const variableCostCompute = useMemo(() => {
        return () => {
            const yarn = yarnCostCompute()
            if (yarn == null) return null
            const sizing = toNum(data.sizing_cost_per_yard, 0)
            const packing = toNum(data.packing_cost_per_yard, 0)
            const dyeWaste = toNum(data.dyeing_waste, 0)
            const total = yarn + sizing + packing + dyeWaste
            return Math.round((total + Number.EPSILON) * 100) / 100
        }
    }, [yarnCostCompute, data.sizing_cost_per_yard, data.packing_cost_per_yard, data.dyeing_waste])

    const rejectionYardCompute = useMemo(() => {
        return () => {
            const m = toNum(data.rejection_sale_price_per_meter, NaN)
            if (Number.isNaN(m)) return null
            return Math.round(((m / 1.0936) + Number.EPSILON) * 100) / 100
        }
    }, [data.rejection_sale_price_per_meter])


    const rejectionQtyCompute = useMemo(() => {
        return () => {
            const yards = toNum(data.yards_per_day_per_loom, NaN)
            const rejPct = toNum(data.reject_percent, NaN)
            if (Number.isNaN(yards) || Number.isNaN(rejPct)) return null
            const qty = yards / (1 - rejPct / 100) - yards
            return Math.round(qty)
        }
    }, [data.yards_per_day_per_loom, data.reject_percent])

    const costOfRejectionCompute = useMemo(() => {
        return () => {
            const rejYard = rejectionYardCompute()
            const varCost = variableCostCompute()
            if (rejYard == null || varCost == null) return null
            return Math.round(((rejYard - varCost) + Number.EPSILON) * 100) / 100
        }
    }, [rejectionYardCompute, variableCostCompute])

    const lossOfRecoveryCompute = useMemo(() => {
        return () => {
            const cost = costOfRejectionCompute()
            const qty = rejectionQtyCompute()
            if (cost == null || qty == null) return null
            return Math.round(((cost * qty) + Number.EPSILON) * 100) / 100
        }
    }, [costOfRejectionCompute, rejectionQtyCompute])

    const targetProfitDayLoomCompute = useMemo(() => {
        return () => {
            const rec = toNum(data.recovery, NaN)
            const loss = lossOfRecoveryCompute()
            if (!Number.isFinite(rec) || loss == null) return null
            return Math.round(((rec - loss) + Number.EPSILON) * 100) / 100
        }
    }, [data.recovery, lossOfRecoveryCompute])

  return (
    <div className="space-y-4 overflow-x-hidden">
      <HeaderCard data={data} />

      <TwoCol>
        <Card>
          <div className="grid gap-4 grid-cols-2">
            <Stat label="GSM" value={data.gsm ?? data.greige_gsm} ring="border-emerald-200/80" />
            <Stat label="GSY" value={data.gsy} ring="border-sky-200/80" />
            <Stat label="Fabric Width Inches" value={fabricInches ?? data.greige_width} ring="border-violet-200/80" />
            <NumWidthStat
              loomBand={data.loom_band}
              loomType={data.loom_type}
              widthIn={data.greige_width}
              initialValue={data.num_width}
            />
          </div>
        </Card>

        <Card title="Counts & Density" Icon={Layers} headerColor="sky">
          <div className="grid grid-cols-2 gap-x-8">
            <div className="space-y-1.5">
              <KV k="Warp Count" v={data.warp_count} />
              <KV k="Warp Density" v={data.warp_density} />
              <KV k="Finished Width (cm)" v={data.finished_width_cm} />
            </div>
            <div className="space-y-1.5">
              <KV k="Weft Count" v={data.weft_count} />
              <KV k="Weft Density" v={data.weft_density} />
            </div>
          </div>
        </Card>
      </TwoCol>

      <div className="grid gap-3 md:grid-cols-2 auto-rows-fr items-stretch">
        <Card title="Weaving Parameters" headerColor="amber" className="row-span-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-7 w-7 grid place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"><Gauge size={16} /></span>
                <span className="text-gray-600 dark:text-white/70 truncate">Band</span>
              </div>
              <span className="font-medium">{data.loom_band ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-7 w-7 grid place-items-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300"><Cog size={16} /></span>
                <span className="text-gray-600 dark:text-white/70 truncate">Loom Type</span>
              </div>
              <span className="font-medium">{data.loom_type ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-7 w-7 grid place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"><Cog size={16} /></span>
                <span className="text-gray-600 dark:text-white/70 truncate">Machine Type</span>
              </div>
              <span className="font-medium">{data.machine_type ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-7 w-7 grid place-items-center rounded-xl bg-sky-100 text-sky-400 dark:bg-sky-900/30 dark:text-sky-300"><Wind size={16} /></span>
                <span className="text-gray-600 dark:text-white/70 truncate">Weft Method</span>
              </div>
              <span className="font-medium">{data.weft_method ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-7 w-7 grid place-items-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300"><Layers size={16} /></span>
                <span className="text-gray-600 dark:text-white/70 truncate">Weave</span>
              </div>
              <span className="font-medium">{data.weave ?? "-"}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Stat label="Loom Speed" value={data.loom_speed} ring="border-amber-200/80" />
            <Stat label="Efficiency %" value={data.efficiency} ring="border-emerald-200/80" />
            <Stat label="Reject %" value={data.reject_percent} ring="border-rose-200/80" />
          </div>
        </Card>

        <Card title="Crimp & Waste" Icon={Percent} headerColor="emerald">
          <div className="grid grid-cols-2 gap-x-8">
            <div className="space-y-1.5">
              <KV k="Percent Warp Crimp" v={data.percent_warp_crimp} />
              <KV k="Remainder Percent" v={data.remainder_percent} />
              <KV k="Yards/Day/Loom" v={data.yards_per_day_per_loom} />
            </div>
            <div className="space-y-1.5">
              <KV k="Percent Weft Crimp" v={data.percent_weft_crimp} />
              <KV k="Sized Waste Percent" v={data.sized_waste_percent} />
              <KV k="Selv. Waste Percent" v={data.selv_waste_percent} />
            </div>
          </div>
        </Card>

        <Card title="Yarn Consumption" Icon={Layers} headerColor="violet">
          <div className="grid grid-cols-2 gap-x-8">
            <KV k="Warp Cons./Yard" v={data.warp_cons_per_yard} />
            <KV k="Weft Cons./Yard" v={data.weft_cons_per_yard} />
          </div>
        </Card>
      </div>

      <Card title="Cost Inputs" Icon={Calculator} headerColor="cyan">
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <EditableKV
            label="Warp Cost per 10 Lbs"
            value={data.warp_cost_per_10lbs}
            type="number"
            step="0.01"
            onSave={onChangeCosts ? (val) => onChangeCosts({ warp_cost_per_10lbs: val }) : undefined}
            prefix=""
            suffix=""
          />
          <EditableKV
            label="Weft Cost per 10 Lbs"
            value={data.weft_cost_per_10lbs}
            type="number"
            step="0.01"
            onSave={onChangeCosts ? (val) => onChangeCosts({ weft_cost_per_10lbs: val }) : undefined}
            prefix=""
            suffix=""
          />
          <EditableKV
            label="Packing Cost /Yard"
            value={data.packing_cost_per_yard}
            type="number"
            step="0.01"
            onSave={onChangeCosts ? (val) => onChangeCosts({ packing_cost_per_yard: val }) : undefined}
            prefix=""
            suffix=""
          />
          <KV k="Dyeing Charges /Kg Warp" v={data.dyeing_charges_perkg_warp} />
          <KV k="Dyeing Charges /Kg Weft" v={data.dyeing_charges_perkg_weft} />
          <KV k="Colour Coverage Warp %" v={data.color_coverage_warp_percent} />
          <KV k="Colour Coverage Weft %" v={data.color_coverage_weft_percent} />
          <KV k="Sizing Cost /Kg" v={data.sizing_cost_perkg} />
        </div>
      </Card>

      <Card title="Freight & Shipment" Icon={Truck} headerColor="teal">
        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          <EditableKV
            label="Tons per Container"
            value={data.tons_per_container}
            type="number"
            step="0.01"
            onSave={onChangeCosts ? (val) => onChangeCosts({ tons_per_container: val }) : undefined}
            prefix=""
            suffix=""
          />
          <KV k="Max. Yards per FCL" v={data.max_yards_per_fcl} />
          <KV k="Shipment Yards" v={data.shipment_yards} />
        </div>
      </Card>

      <TwoCol>
        <Card title="Costing Summary" Icon={DollarSign} headerColor="emerald">
          <div className="grid gap-5 grid-cols-2">
            <ComputedKV
              label="Yarn Cost/Yard"
              compute={yarnCostCompute}
              deps={[
                data.warp_cons_per_yard,
                data.weft_cons_per_yard,
                data.warp_cost_per_10lbs,
                data.weft_cost_per_10lbs,
                data.dyeing_charges_perkg_warp,
                data.dyeing_charges_perkg_weft,
                data.color_coverage_warp_percent,
                data.color_coverage_weft_percent,
              ]}
              precision={2}
            />
            <KV k="Dyeing Waste" v={data.dyeing_waste} />
            <KV k="Sizing Cost/Yard" v={data.sizing_cost_per_yard} />
              <ComputedKV
                  label="Variable Cost/Yard"
                  compute={variableCostCompute}
                  deps={[
                      data.warp_cons_per_yard,
                      data.weft_cons_per_yard,
                      data.warp_cost_per_10lbs,
                      data.weft_cost_per_10lbs,
                      data.dyeing_charges_perkg_warp,
                      data.dyeing_charges_perkg_weft,
                      data.color_coverage_warp_percent,
                      data.color_coverage_weft_percent,
                      data.sizing_cost_per_yard,
                      data.packing_cost_per_yard,
                      data.dyeing_waste,
                  ]}
                  precision={2}
              />
          </div>
        </Card>

          <Card title="Pricing & Targets" Icon={TrendingUp} headerColor="violet">
              <div className="grid gap-5 grid-cols-2">
                  <ComputedKV
                      label="Target Profit/Day/Loom"
                      compute={targetProfitDayLoomCompute}
                      deps={[
                          data.recovery,
                          data.rejection_sale_price_per_meter,
                          data.warp_cons_per_yard,
                          data.weft_cons_per_yard,
                          data.warp_cost_per_10lbs,
                          data.weft_cost_per_10lbs,
                          data.dyeing_charges_perkg_warp,
                          data.dyeing_charges_perkg_weft,
                          data.color_coverage_warp_percent,
                          data.color_coverage_weft_percent,
                          data.sizing_cost_per_yard,
                          data.packing_cost_per_yard,
                          data.dyeing_waste,
                          data.yards_per_day_per_loom,
                          data.reject_percent,
                      ]}
                      precision={2}
                  />
                  <KV k="Target Price/Yard" v={data.target_price_per_yard}/>
                  <KV k="Target Price/Mtr" v={data.target_price_per_meter}/>
                  <KV k="Final Fin. Fab Cost/Mtr (w/rej %)" v={data.final_fabric_cost_per_meter}/>
                  <EditableKV
                      label="Exchange Rate"
                      value={data.exchange_rate}
                      type="number"
                      step="0.01"
                      onSave={onChangeCosts ? (val) => onChangeCosts({exchange_rate: val}) : undefined}
                      prefix=""
                      suffix=""
                  />
              </div>
          </Card>

      </TwoCol>

        <Card title="Rejection & Recovery" Icon={ClipboardList} headerColor="rose">
            <div className="grid gap-5 grid-cols-3">
                <EditableKV
                    label="Rejection Sale Price per Meter"
                    value={data.rejection_sale_price_per_meter}
                    type="number"
                    step="0.01"
                    onSave={onChangeCosts ? (val) => onChangeCosts({rejection_sale_price_per_meter: val}) : undefined}
                    prefix=""
                    suffix=""
                />
                <ComputedKV
                    label="Rejection Sale Price per Yard"
                    compute={rejectionYardCompute}
                    deps={[data.rejection_sale_price_per_meter]}
                    precision={2}
                />
                <ComputedKV
                    label="Rejection Quantity"
                    compute={rejectionQtyCompute}
                    deps={[data.yards_per_day_per_loom, data.reject_percent]}
                    precision={0}
                />
                <ComputedKV
                    label="Cost of Rejection"
                    compute={costOfRejectionCompute}
                    deps={[
                        data.rejection_sale_price_per_meter,
                        data.warp_cons_per_yard,
                        data.weft_cons_per_yard,
                        data.warp_cost_per_10lbs,
                        data.weft_cost_per_10lbs,
                        data.dyeing_charges_perkg_warp,
                        data.dyeing_charges_perkg_weft,
                        data.color_coverage_warp_percent,
                        data.color_coverage_weft_percent,
                        data.sizing_cost_per_yard,
                        data.packing_cost_per_yard,
                        data.dyeing_waste,
                    ]}
                    precision={2}
                />
                <ComputedKV
                    label="Loss of Recovery due to Rejection"
                    compute={lossOfRecoveryCompute}
                    deps={[
                        data.rejection_sale_price_per_meter,
                        data.warp_cons_per_yard,
                        data.weft_cons_per_yard,
                        data.warp_cost_per_10lbs,
                        data.weft_cost_per_10lbs,
                        data.dyeing_charges_perkg_warp,
                        data.dyeing_charges_perkg_weft,
                        data.color_coverage_warp_percent,
                        data.color_coverage_weft_percent,
                        data.sizing_cost_per_yard,
                        data.packing_cost_per_yard,
                        data.dyeing_waste,
                        data.yards_per_day_per_loom,
                        data.reject_percent,
                    ]}
                    precision={2}
                />
                <KV k="Recovery after Accounting for Rejection" v={data.recovery_after_rejection ?? data.recovery}/>
            </div>
        </Card>



    </div>
  )
}

export default AirjetCostingBaseCards

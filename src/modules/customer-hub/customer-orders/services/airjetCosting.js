export const LBS_PER_KG = 2.2046
const BLEACH_RATE_PER_KG = 55

export const toNum = (x, fb = NaN) => {
  const n = Number(x)
  return Number.isFinite(n) ? n : fb
}

export const pick = (o, keys) =>
  keys.map(k => o?.[k]).find(v => v !== undefined && v !== null && v !== "") || ""

export const buildParams = (seed) => {
  const s = seed || {}
  const agreement_id = s?.id || s?.agreement?.id || undefined
  const email_id = agreement_id ? undefined : (s?.email_id || s?.email?.id || undefined)

  const quality_code = pick(s, ["quality_code", "quality"])

  const greige_item_code =
    (Array.isArray(s.customer_item_matches) && s.customer_item_matches[0]
      ? s.customer_item_matches[0].greige_item_code
      : undefined)

  const design = pick(s, ["design", "greige_design"])
  const color = pick(s, ["colour", "greige_color"])
  const width =
    s?.payload?.width_inches ||
    (Array.isArray(s.customer_item_matches) && s.customer_item_matches[0]
      ? s.customer_item_matches[0].greige_width
      : undefined)

  return {
    quality_code,
    greige_item_code,
    design,
    color,
    width,
    agreement_id,
    email_id,
  }
}

export const makeYarnCostPerYard = (d) => () => {
  const warpCons = toNum(d.warp_cons_per_yard, NaN)
  const weftCons = toNum(d.weft_cons_per_yard, NaN)
  if (Number.isNaN(warpCons) || Number.isNaN(weftCons)) return null

  const warpCost10 = toNum(d.warp_cost_per_10lbs, 0)
  const weftCost10 = toNum(d.weft_cost_per_10lbs, 0)

  const dyeWarpPerKg = toNum(d.dyeing_charges_perkg_warp, 0)
  const dyeWeftPerKg = toNum(d.dyeing_charges_perkg_weft, 0)

  const covWarp = toNum(d.color_coverage_warp_percent, 0)
  const covWeft = toNum(d.color_coverage_weft_percent, 0)

  const bleachWarp = toNum(
    d.bleached_white_coverage_warp_percent ??
    d.bleached_white_coverage_warp ??
    d.bleach_coverage_warp_percent ??
    d.bleach_coverage_warp,
    0
  )

  const bleachWeft = toNum(
    d.bleached_white_coverage_weft_percent ??
    d.bleached_white_coverage_weft ??
    d.bleach_coverage_weft_percent ??
    d.bleach_coverage_weft,
    0
  )

  let warpBase
  if (covWarp === 100) {
    warpBase = (dyeWarpPerKg / LBS_PER_KG) * 10 + warpCost10
  } else {
    const colorPartWarp = (covWarp / 100) * (dyeWarpPerKg / LBS_PER_KG) * 10
    const bleachPartWarp = (bleachWarp / 100) * (BLEACH_RATE_PER_KG / LBS_PER_KG) * 10
    warpBase = colorPartWarp + bleachPartWarp + warpCost10
  }

  let weftBase
  if (covWeft === 100) {
    weftBase = (dyeWeftPerKg / LBS_PER_KG) * 10 + weftCost10
  } else {
    const colorPartWeft = (covWeft / 100) * (dyeWeftPerKg / LBS_PER_KG) * 10
    const bleachPartWeft = (bleachWeft / 100) * (BLEACH_RATE_PER_KG / LBS_PER_KG) * 10
    weftBase = colorPartWeft + bleachPartWeft + weftCost10
  }

  const warpComponent = warpBase * (warpCons / 10)
  const weftComponent = weftBase * (weftCons / 10)

  const total = warpComponent + weftComponent
  return Math.round((total + Number.EPSILON) * 100) / 100
}

export const makeDyeWastePerYard = (d) => () => {
  const yarn = makeYarnCostPerYard(d)()
  if (yarn == null) return null
  const factor = toNum(d.dyeing_waste, NaN)
  if (!Number.isFinite(factor)) return null
  const value = yarn * factor
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export const makeVariableCostPerYard = (d) => () => {
  const yarn = makeYarnCostPerYard(d)()
  if (yarn == null) return null
  const dyeWaste = makeDyeWastePerYard(d)() ?? 0
  const sizing = toNum(d.sizing_cost_per_yard, 0)
  const freight = toNum(d.freight_per_yard, 0)
  const rebate = toNum(d.rebate_per_yard, 0)
  const packing = toNum(d.packing_cost_per_yard, 0)
  const total = yarn + dyeWaste + sizing + freight + rebate + packing
  return Math.round((total + Number.EPSILON) * 100) / 100
}

export const makeRejectionSalePerYard = (d) => () => {
  const m = toNum(d.rejection_sale_price_per_meter, NaN)
  if (Number.isNaN(m)) return null
  return Math.round(((m / 1.0936) + Number.EPSILON) * 100) / 100
}

export const makeRejectionQty = (d) => () => {
  const yards = toNum(d.yards_per_day_per_loom, NaN)
  const rejPct = toNum(d.reject_percent, NaN)
  if (Number.isNaN(yards) || Number.isNaN(rejPct)) return null
  const qty = yards / (1 - rejPct / 100) - yards
  return Math.round(qty)
}

export const makeCostOfRejection = (d) => () => {
  const rejYard = makeRejectionSalePerYard(d)()
  const varCost = makeVariableCostPerYard(d)()
  if (rejYard == null || varCost == null) return null
  return Math.round(((rejYard - varCost) + Number.EPSILON) * 100) / 100
}

export const makeLossOfRecovery = (d) => () => {
  const cost = makeCostOfRejection(d)()
  const qty = makeRejectionQty(d)()
  if (cost == null || qty == null) return null
  return Math.round(((cost * qty) + Number.EPSILON) * 100) / 100
}

export const makeTargetProfitPerDayLoom = (d) => () => {
  const rec = toNum(d.recovery, NaN)
  const loss = makeLossOfRecovery(d)()
  if (!Number.isFinite(rec) || loss == null) return null
  return Math.round(((rec - loss) + Number.EPSILON) * 100) / 100
}

export const makeTargetPricePerYard = (d) => () => {
  const yards = toNum(d.yards_per_day_per_loom, NaN)
  const exch = toNum(d.exchange_rate, 1)
  const varCost = makeVariableCostPerYard(d)()
  const targ = makeTargetProfitPerDayLoom(d)()
  if (!Number.isFinite(yards) || varCost == null || targ == null) return null
  const base = (targ + toNum(d.conversion_per_day, 0)) / yards
  const yard = (base / exch) + varCost
  return Math.round(((yard) + Number.EPSILON) * 100) / 100
}

export const makeTargetPricePerMeter = (d) => () => {
  const y = makeTargetPricePerYard(d)()
  if (y == null) return null
  return Math.round(((y * 1.0936) + Number.EPSILON) * 100) / 100
}

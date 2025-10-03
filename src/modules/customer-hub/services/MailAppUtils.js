const normalizeCid = (s) => (s || "").replace(/[<>]/g, "").toLowerCase()

export const resolveCidHtml = (html, attachments) => {
  if (!html || !attachments?.length) return html || ""
  const findUrl = (cid) => {
    const a = attachments.find(x => normalizeCid(x.content_id) === normalizeCid(cid))
    return a?.url || null
  }
  let out = html
  out = out.replace(/src=(['"])cid:([^'"]+)\1/gi, (_, q, cid) => {
    const u = findUrl(cid)
    return u ? `src=${q}${u}${q}` : _
  })
  out = out.replace(/url\((['"]?)cid:([^'")]+)\1\)/gi, (_, q, cid) => {
    const u = findUrl(cid)
    return u ? `url(${u})` : _
  })
  return out
}

export const truncateWords = (s, n = 4) => {
  if (!s) return ""
  const words = s.trim().split(/\s+/)
  return words.length <= n ? s : words.slice(0, n).join(" ") + "…"
}

export const fileKind = (a) => {
  const t = (a.content_type || "").toLowerCase()
  const n = (a.name || "").toLowerCase()
  if (t.includes("spreadsheet") || t.includes("excel") || n.match(/\.(xlsx?|csv)$/)) return "excel"
  if (t.startsWith("image/") || n.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/)) return "image"
  if (t.includes("pdf") || n.endsWith(".pdf")) return "pdf"
  return "doc"
}

export const sanitizeHtml = (html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html || "", "text/html")
  doc.querySelectorAll("script, style").forEach(el => el.remove())
  doc.querySelectorAll("a").forEach(el => {
    const t = el.textContent || ""
    const tn = doc.createTextNode(t)
    el.replaceWith(tn)
  })
  return doc.body.innerHTML
}

const SAFE_TAGS = new Set([
  "div",
  "span",
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "a",
])

const SAFE_ATTRS = new Set([
  "href",
  "target",
  "rel",
  "class",
  "data-pms-kind",
  "data-pms-id",
])

function isSafeUrl(value) {
  const s = String(value || "").trim().toLowerCase()
  if (!s) return false
  if (s.startsWith("javascript:") || s.startsWith("data:")) return false
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("#") || s.startsWith("mailto:")
}

export default function sanitizeHtml(input) {
  if (!input) return ""
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return String(input)

  const parser = new DOMParser()
  const doc = parser.parseFromString(String(input), "text/html")

  const walk = (node) => {
    const children = Array.from(node.childNodes)
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child
        const tag = el.tagName.toLowerCase()
        if (!SAFE_TAGS.has(tag)) {
          const text = doc.createTextNode(el.textContent || "")
          el.replaceWith(text)
          continue
        }

        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase()
          if (name.startsWith("on") || name === "style") {
            el.removeAttribute(attr.name)
            continue
          }
          if (!SAFE_ATTRS.has(name)) {
            el.removeAttribute(attr.name)
            continue
          }
          if (name === "href" && !isSafeUrl(attr.value)) {
            el.removeAttribute("href")
          }
        }

        if (tag === "a") {
          const target = el.getAttribute("target")
          if (target === "_blank") {
            const rel = new Set(String(el.getAttribute("rel") || "").split(/\s+/).filter(Boolean))
            rel.add("noopener")
            rel.add("noreferrer")
            el.setAttribute("rel", Array.from(rel).join(" "))
          }
        }

        walk(el)
      }
    }
  }

  walk(doc.body)
  return doc.body.innerHTML
}

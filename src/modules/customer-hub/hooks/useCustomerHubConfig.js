import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { createHubConfig, getCurrentHubConfig, getHubConfig, updateHubConfig } from "@modules/customer-hub/services/CustomerHubConfigService.js";

const looksLikeRegex = s => /[\\[\]().^$+?{|}]/.test(String(s || ''))
const isOurSubjectRegex = s => /\\b/.test(s || '') || /\\s\+/.test(s || '') || /\.\*/.test(s || '')
const escapeRegex = str => str.replace(/[.+?^${}()|[\]\\]/g, '\\$&')

const regexToFriendly = r => {
  if (!r) return ''
  let s = String(r).trim()
  if (!isOurSubjectRegex(s)) return s
  s = s.replace(/^\\b/, '').replace(/\\b$/, '')
  s = s.replace(/\\s\+/g, ' ')
  s = s.replace(/\.\*/g, '*')
  s = s.replace(/\\([^\w])/g, '$1')
  return s
}

const labelTextToRegex = s => {
  if (!s) return null
  if (looksLikeRegex(s)) return s
  const tokens = String(s).trim().match(/[A-Za-z0-9]+/g) || []
  if (!tokens.length) return null
  let pat = tokens.join('[^A-Za-z0-9]*')
  pat = pat.replace(/^No$/i, '(?:No|No\\.|Number|#)')
  return pat
}

const castValue = (v, t) => {
  if (t === 'int') {
    const n = String(v || '').replace(/[^0-9-]/g, '')
    return n === '' || n === '-' ? null : parseInt(n, 10)
  }
  if (t === 'decimal') {
    const n = String(v || '').replace(/[^0-9.\-]/g, '')
    return /\d/.test(n) ? n : null
  }
  if (t === 'date') {
    const s = String(v || '').trim()
    const fmts = [
      [/^(\d{2})-(\d{2})-(\d{2})$/, d => `20${d[3]}-${d[2]}-${d[1]}`],
      [/^(\d{2})-(\d{2})-(\d{4})$/, d => `${d[3]}-${d[2]}-${d[1]}`],
      [/^(\d{4})-(\d{2})-(\d{2})$/, d => `${d[1]}-${d[2]}-${d[3]}`],
      [/^(\d{2})\/(\d{2})\/(\d{4})$/, d => `${d[3]}-${d[2]}-${d[1]}`],
      [/^(\d{2})\/(\d{2})\/(\d{2})$/, d => `20${d[3]}-${d[2]}-${d[1]}`],
    ]
    for (const [re, f] of fmts) {
      const m = s.match(re)
      if (m) return f(m)
    }
    return null
  }
  return String(v || '').trim() || null
}

const parseWithRules = (body, rules) => {
  const htmlDecoded = new DOMParser().parseFromString(String(body || ''), 'text/html').documentElement.textContent || ''
  const text = String(htmlDecoded)
    .replace(/<(script|style)[^>]*>.*?<\/\1>/gis, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p\s*>/gi, '\n')
    .replace(/<\/div\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n/g, '\n')
  const lines = text.split('\n')
  const labs = []
  const compiled = {}
  for (const r of rules || []) {
    const raw = r.label_re || r.label
    const lab = labelTextToRegex(raw)
    if (lab) {
      labs.push(lab)
      compiled[r.key] = new RegExp(`^[ \\t\\u00a0]*${lab}[ \\t\\u00a0]*[:\\-–—]?[ \\t\\u00a0]*(.*)$`, 'i')
    }
  }
  const union = labs.length ? new RegExp(`^[ \\t\\u00a0]*(?:${labs.join('|')})[ \\t\\u00a0]*[:\\-–—]?[ \\t\\u00a0]*`, 'i') : null
  const typeOf = {}
  for (const r of rules || []) typeOf[r.key] = r.type || 'str'
  const out = {}
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    let matchedKey = null
    let initial = ''
    for (const key of Object.keys(compiled)) {
      const m = compiled[key].exec(line || '')
      if (m) {
        matchedKey = key
        initial = (m[1] || '').trim()
        break
      }
    }
    if (!matchedKey) {
      i += 1
      continue
    }
    let j = i + 1
    const parts = initial ? [initial] : []
    while (j < lines.length && !(union && union.test(lines[j] || ''))) {
      const seg = (lines[j] || '').trim()
      if (seg) parts.push(seg)
      j += 1
    }
    const rawVal = parts.join(' ').trim()
    const typ = typeOf[matchedKey] || 'str'
    out[matchedKey] = rawVal === '' ? null : castValue(rawVal, typ)
    i = j
  }
  return out
}

const toPlain = arr =>
  (arr || [])
    .map(x => typeof x === 'string' ? x : (x?.value ?? ''))
    .map(s => String(s).trim())
    .filter(Boolean)

const uniq = arr => Array.from(new Set(arr || []))
const ensureOne = arr => (arr && arr.length ? arr : [{ value: '' }])
const ensureOneRule = arr => (arr && arr.length ? arr : [{ label_re: '', key: '', type: 'str' }])

const toFormShape = e => ({
  active: !!e.active,
  mailbox_email: e.mailbox_email || '',
  use_unread_only: !!e.use_unread_only,
  subject_patterns: ensureOne((e.subject_patterns || []).map(regexToFriendly).map(v => ({ value: v }))),
  from_filters: ensureOne((e.from_filters || []).map(v => ({ value: v }))),
  body_rules: { kv_rules: ensureOneRule(e.body_rules?.kv_rules || []) },
  preview_body: ''
})

export const useCustomerHubConfig = (initialId, opts = {}) => {
  const { forceBlank = false } = opts
  const [currentId, setCurrentId] = useState(initialId || null)

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors }
  } = useForm({ defaultValues: toFormShape({}) })

  const subjectFA = useFieldArray({ control, name: 'subject_patterns' })
  const fromFA    = useFieldArray({ control, name: 'from_filters' })
  const rulesFA   = useFieldArray({ control, name: 'body_rules.kv_rules' })

  const values = watch()

  const parsedPreview = useMemo(
    () => parseWithRules(values.preview_body, values.body_rules?.kv_rules),
    [values.preview_body, values.body_rules]
  )

  useEffect(() => {
    const boot = async () => {
      if (forceBlank) {
        reset(toFormShape({}))
        return
      }
      if (currentId) {
        const res = await getHubConfig(currentId)
        reset(toFormShape(res))
        return
      }
      const cur = await getCurrentHubConfig()
      if (cur) {
        setCurrentId(cur.id)
        reset(toFormShape(cur))
      } else {
        reset(toFormShape({}))
      }
    }
    boot()
  }, [currentId, reset, forceBlank])

  useEffect(() => {
    if (subjectFA.fields.length === 0) subjectFA.append({ value: '' })
    if (fromFA.fields.length === 0)    fromFA.append({ value: '' })
    if (rulesFA.fields.length === 0)   rulesFA.append({ label_re: '', key: '', type: 'str' })
  }, [subjectFA.fields.length, fromFA.fields.length, rulesFA.fields.length])

  const onSubmit = async d => {
    const subjects = uniq(toPlain(d.subject_patterns))
    const payload = {
      active: true,
      mailbox_email: d.mailbox_email,
      use_unread_only: !!d.use_unread_only,
      subject_patterns: subjects,
      from_filters: uniq(toPlain(d.from_filters)),
      body_rules: {
        kv_rules: ensureOneRule(d.body_rules.kv_rules).map(r => ({
          label_re: String(r.label_re || '').trim(),
          key: String(r.key || '').trim(),
          type: r.type || 'str'
        }))
      }
    }

    const saved = currentId
      ? await updateHubConfig(currentId, payload)
      : await createHubConfig(payload)

    setCurrentId(saved.id)
    reset(toFormShape(saved))
  }

  return {
    handleSubmit,
    onSubmit,
    control,
    errors,
    isSubmitting,
    subjectFA,
    fromFA,
    rulesFA,
    parsedPreview
  }
}

import { useCallback, useEffect, useRef, useState } from "react"

export const useInternetStatus = ({
  probeUrls = [
    "https://www.google.com/generate_204",
    "https://connectivitycheck.gstatic.com/generate_204",
  ],
  timeoutMs = 3000,
  pollMs = 0, // 0 disables polling
} = {}) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )

  const runningRef = useRef(false)
  const isOnlineRef = useRef(isOnline)

  useEffect(() => {
    isOnlineRef.current = isOnline
  }, [isOnline])

  const setOnlineSafe = useCallback((v) => {
    setIsOnline((prev) => (prev === v ? prev : v))
  }, [])

  const probeOnce = useCallback(
    async (url) => {
      const ac = new AbortController()
      const t = setTimeout(() => ac.abort(), timeoutMs)

      try {
        await fetch(`${url}?t=${Date.now()}`, {
          method: "GET",
          mode: "no-cors",
          cache: "no-store",
          signal: ac.signal,
        })
        return true
      } catch {
        return false
      } finally {
        clearTimeout(t)
      }
    },
    [timeoutMs]
  )

  const probe = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setOnlineSafe(false)
      return false
    }

    if (runningRef.current) return isOnlineRef.current
    runningRef.current = true

    try {
      for (const url of probeUrls) {
        if (await probeOnce(url)) {
          setOnlineSafe(true)
          return true
        }
      }
      setOnlineSafe(false)
      return false
    } finally {
      runningRef.current = false
    }
  }, [probeUrls, probeOnce, setOnlineSafe])

  useEffect(() => {
    const on = () => probe()
    const off = () => setOnlineSafe(false)

    window.addEventListener("online", on)
    window.addEventListener("offline", off)

    const onVis = () => {
      if (document.visibilityState === "visible") probe()
    }
    document.addEventListener("visibilitychange", onVis)

    // initial probe (optional but useful)
    probe()

    let id
    if (pollMs > 0) id = setInterval(probe, pollMs)

    return () => {
      window.removeEventListener("online", on)
      window.removeEventListener("offline", off)
      document.removeEventListener("visibilitychange", onVis)
      if (id) clearInterval(id)
    }
  }, [probe, pollMs, setOnlineSafe])

  return { isOnline, probe }
}

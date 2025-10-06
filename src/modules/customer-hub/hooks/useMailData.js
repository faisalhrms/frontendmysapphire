import { useEffect, useMemo, useState, useCallback } from "react"
import dayjs from "dayjs"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { getExtractionsByEmail, getThreadMessages, getThreadsPage, markRead, getMailboxes } from "@modules/customer-hub/services/CustomerHubMailService.js"

export const useCustomerHubMail = (mailbox) => {
  const qc = useQueryClient()
  const [mailboxes, setMailboxes] = useState([])
  const [messagesByThread, setMessagesByThread] = useState({})
  const [expanded, setExpanded] = useState({})
  const [selectedKey, setSelectedKey] = useState(null)
  const [messages, setMessages] = useState([])
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const [extractions, setExtractions] = useState([])
  const limit = 20
  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1, triggerOnce: false })

  const fetchThreads = ({ pageParam = 0 }) => getThreadsPage(mailbox, pageParam, limit)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ["chThreads", mailbox],
    queryFn: fetchThreads,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.current_page * limit
      return lastPage.current_page < lastPage.total_pages ? nextSkip : undefined
    },
    staleTime: 60_000,
  })

  const patchThreads = useCallback((fn) => {
    qc.setQueryData(["chThreads", mailbox], (old) => {
      if (!old) return old
      return {
        ...old,
        pages: (old.pages || []).map((p) => ({
          ...p,
          rows: (p.rows || []).map((r) => fn(r)),
        })),
      }
    })
  }, [qc, mailbox])

  const threads = useMemo(() => (data?.pages || []).flatMap((p) => p.rows || []), [data])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const loadMailboxes = useCallback(async () => {
    const list = await getMailboxes()
    setMailboxes(list || [])
  }, [])

  useEffect(() => { loadMailboxes() }, [loadMailboxes])

  useEffect(() => {
    setSelectedKey(null)
    setMessagesByThread({})
    setMessages([])
    setSelectedMessageId(null)
    setExtractions([])
    setExpanded({})
    refetch()
  }, [mailbox, refetch])

  const fetchThreadMessages = useCallback(async (key) => {
    const m = await getThreadMessages(key, mailbox)
    setMessagesByThread((prev) => ({ ...prev, [key]: m }))
    return m
  }, [mailbox])

  const toggleThreadExpand = useCallback(async (key) => {
    setExpanded((e) => ({ ...e, [key]: !e[key] }))
    if (!messagesByThread[key]) await fetchThreadMessages(key)
  }, [messagesByThread, fetchThreadMessages])

  const loadMessages = useCallback(async (key) => {
    await markRead({ threadKey: key, mailbox })
    patchThreads((r) => (r.thread_key === key ? { ...r, unread_count: 0 } : r))
    const m = await fetchThreadMessages(key)
    setMessages(m.map((x) => ({ ...x, is_read: true })))
    if (m.length) setSelectedMessageId(m[0].id)
  }, [mailbox, fetchThreadMessages, patchThreads])

  const selectThread = useCallback((key) => {
    setSelectedKey(key)
    loadMessages(key)
  }, [loadMessages])

  const selectMessageInThread = useCallback(async (threadKey, id) => {
    setSelectedKey(threadKey)
    if (!messagesByThread[threadKey]) await fetchThreadMessages(threadKey)
    const list = messagesByThread[threadKey] || []
    setMessages(list)
    setSelectedMessageId(id)
    const msg = list.find((x) => x.id === id)
    if (msg && !msg.is_read) {
      await markRead({ emailId: id, mailbox })
      const updated = list.map((x) => (x.id === id ? { ...x, is_read: true } : x))
      setMessages(updated)
      setMessagesByThread((prev) => ({ ...prev, [threadKey]: updated }))
      patchThreads((r) => (r.thread_key === threadKey ? { ...r, unread_count: Math.max(0, (r.unread_count || 0) - 1) } : r))
    }
  }, [mailbox, messagesByThread, fetchThreadMessages, patchThreads])

  useEffect(() => {
    const run = async () => {
      if (!selectedMessageId) {
        setExtractions([])
        return
      }
      const ext = await getExtractionsByEmail(selectedMessageId, mailbox)
      setExtractions(ext)
    }
    run()
  }, [selectedMessageId, mailbox])

  const selectedMessage = useMemo(() => messages.find((x) => x.id === selectedMessageId) || null, [messages, selectedMessageId])
  const formatThreadTime = (iso) => dayjs(iso).format("h:mm A")
  const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return ""
    const kb = bytes / 1024
    if (kb < 1024) return `${Math.round(kb)}KB`
    return `${(kb / 1024).toFixed(2)}MB`
  }

  return {
    mailboxes,
    threads,
    selectedKey,
    selectThread,
    selectedMessage,
    selectMessageInThread,
    expanded,
    toggleThreadExpand,
    messagesByThread,
    formatThreadTime,
    formatFileSize,
    extractions,
    sentinelRef,
    hasNextPage,
    isFetchingNextPage,
  }
}

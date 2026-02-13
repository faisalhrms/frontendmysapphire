import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import {
  datatableAgreementsSidebar,
  isBackendUnreachable,
} from "@modules/customer-hub/customer-orders/services/AgreementService.js"

export const useAgreementsFeed = ({
  s = "",
  mailbox = "",
  limit = 10,
  root = null,
  onBackendStatusChange,
  staleMs = 30_000,
  gcMs = 30 * 60 * 1000,
} = {}) => {
  const queryClient = useQueryClient()
  const scrolledRef = useRef(false)
  const refreshingFirstRef = useRef(false)

  const [canScroll, setCanScroll] = useState(false)
  const [isRefreshingFirstPage, setIsRefreshingFirstPage] = useState(false)

  const queryKey = useMemo(
    () => ["agreementsFeed", s, mailbox, limit],
    [s, mailbox, limit]
  )

  const onListScroll = useCallback(() => {
    scrolledRef.current = true
  }, [])

  const fetchAgreements = ({ pageParam = 0, signal }) =>
    datatableAgreementsSidebar({ skip: pageParam, limit, s, mailbox }, { signal })

  const q = useInfiniteQuery({
    queryKey,
    queryFn: fetchAgreements,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const current = Number(lastPage?.current_page || 1)
      const total = Number(lastPage?.total_pages || 1)
      const nextSkip = current * limit
      return current < total ? nextSkip : undefined
    },
    enabled: !!mailbox,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    staleTime: staleMs,
    gcTime: gcMs,

    retry: (count, err) => (isBackendUnreachable(err) ? count < 1 : count < 2),
    onSuccess: () => onBackendStatusChange?.(false),
    onError: (err) => onBackendStatusChange?.(isBackendUnreachable(err), err),
  })

  const rows = useMemo(
    () => (q.data?.pages || []).flatMap((p) => p?.rows || []),
    [q.data]
  )

  useEffect(() => {
    if (!root) return
    const ok = root.scrollHeight > root.clientHeight + 8
    setCanScroll(ok)
  }, [root, rows.length])

  const { ref: sentinelRef, inView } = useInView({
    root: root || undefined,
    threshold: 0,
    rootMargin: "200px 0px",
    triggerOnce: false,
  })

  useEffect(() => {
    if (!root) return
    if (!inView || !q.hasNextPage || q.isFetchingNextPage) return
    if (!canScroll && !scrolledRef.current) return
    q.fetchNextPage()
  }, [root, inView, q.hasNextPage, q.isFetchingNextPage, q.fetchNextPage, canScroll])

const refreshFirstPage = useCallback(async () => {
  if (!mailbox) return
  if (refreshingFirstRef.current) return

  refreshingFirstRef.current = true
  setIsRefreshingFirstPage(true)

  try {
    await queryClient.cancelQueries({ queryKey, exact: true })

    const first = await datatableAgreementsSidebar({ skip: 0, limit, s, mailbox })
    onBackendStatusChange?.(false)

    queryClient.setQueryData(queryKey, () => ({
      pages: [first],
      pageParams: [0],
    }))

    scrolledRef.current = false
    setCanScroll(false)
  } catch (err) {
    onBackendStatusChange?.(isBackendUnreachable(err), err)
  } finally {
    setIsRefreshingFirstPage(false)
    refreshingFirstRef.current = false
  }
}, [mailbox, limit, s, queryClient, queryKey, onBackendStatusChange])


  useEffect(() => {
    const state = queryClient.getQueryState(queryKey)
    if (!state?.dataUpdatedAt) return
    const age = Date.now() - state.dataUpdatedAt
    if (age > staleMs) refreshFirstPage()
  }, [queryClient, queryKey, staleMs, refreshFirstPage])

  const isInitialLoading = q.isLoading && rows.length === 0

  return {
    rows,
    sentinelRef,
    hasNextPage: q.hasNextPage,
    isFetchingNextPage: q.isFetchingNextPage,
    isLoading: isInitialLoading,
    refreshFirstPage,
    fetchNextPage: q.fetchNextPage,
    onListScroll,
    canScroll,
    isRefreshingFirstPage,
  }
}

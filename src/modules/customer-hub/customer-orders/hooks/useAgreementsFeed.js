import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { datatableAgreementsSidebar, isBackendUnreachable } from "@modules/customer-hub/customer-orders/services/AgreementService.js"

export const useAgreementsFeed = ({
  s = "",
  mailbox = "",
  limit = 10,
  root = null,
  onBackendStatusChange,
} = {}) => {
  const scrolledRef = useRef(false)
  const [canScroll, setCanScroll] = useState(false)

  const onListScroll = useCallback(() => {
    scrolledRef.current = true
  }, [])

  const fetchAgreements = ({ pageParam = 0, signal }) =>
    datatableAgreementsSidebar(
      { skip: pageParam, limit, s, mailbox },
      { signal }
    )

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["agreementsFeed", s, mailbox, limit],
    queryFn: fetchAgreements,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const current = Number(lastPage.current_page || 1)
      const total = Number(lastPage.total_pages || 1)
      const nextSkip = current * limit
      return current < total ? nextSkip : undefined
    },
    enabled: !!mailbox,
    staleTime: 30_000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: (count, err) => (isBackendUnreachable(err) ? count < 1 : count < 2),
    onSuccess: () => onBackendStatusChange?.(false),
    onError: (err) => onBackendStatusChange?.(isBackendUnreachable(err), err),
  })

  const rows = useMemo(
    () => (data?.pages || []).flatMap((p) => p.rows || []),
    [data]
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
    if (!inView || !hasNextPage || isFetchingNextPage) return
    if (!canScroll && !scrolledRef.current) return

    fetchNextPage()
  }, [root, inView, hasNextPage, isFetchingNextPage, fetchNextPage, canScroll])

  return {
    rows,
    sentinelRef,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoading || isRefetching,
    refetch,
    fetchNextPage,
    onListScroll,
    canScroll,
  }
}

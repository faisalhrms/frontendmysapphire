import { useEffect, useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { datatableAgreements } from "@modules/customer-hub/customer-orders/services/AgreementService.js"

export const useAgreementsFeed = ({ s = "", mailbox = "", limit = 10, root = null } = {}) => {
  const fetchAgreements = ({ pageParam = 0 }) =>
    datatableAgreements({ skip: pageParam, limit, s, mailbox })

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching
  } = useInfiniteQuery({
    queryKey: ["agreementsFeed", s, mailbox, limit],
    queryFn: fetchAgreements,
    getNextPageParam: (lastPage) => {
      const current = lastPage.current_page || 1
      const total = lastPage.total_pages || 1
      const nextSkip = current * limit
      return current < total ? nextSkip : undefined
    },
    enabled: !!mailbox,
    retry: 2,
    staleTime: 0,
    refetchOnMount: "always"
  })

  const rows = useMemo(
    () => (data?.pages || []).flatMap((p) => p.rows || []),
    [data]
  )

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    root
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    rows,
    sentinelRef,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoading || isRefetching,
    refetch
  }
}

import { useEffect, useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { datatableAgreements } from "@modules/customer-hub/customer-orders/services/AgreementService.js"

export const useAgreementsFeed = ({ s = "", mailbox = "", limit = 30 } = {}) => {
  const fetchPage = ({ pageParam = 0 }) => datatableAgreements({ skip: pageParam, limit, s, mailbox })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useInfiniteQuery({
    queryKey: ["agreementsFeed", s, mailbox, limit],
    queryFn: fetchPage,
    getNextPageParam: (lastPage) => {
      const nextSkip = (lastPage.current_page || 1) * limit
      return (lastPage.current_page || 1) < (lastPage.total_pages || 1) ? nextSkip : undefined
    },
    staleTime: 60_000
  })
  const rows = useMemo(() => (data?.rows ? data.rows : (data?.pages || []).flatMap((p) => p.rows || [])), [data])
  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1, triggerOnce: false })
  useEffect(() => { refetch() }, [s, mailbox, limit, refetch])
  useEffect(() => { if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage() }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])
  return { rows, sentinelRef, hasNextPage: !!hasNextPage, isFetchingNextPage, isLoading: isLoading || isRefetching }
}

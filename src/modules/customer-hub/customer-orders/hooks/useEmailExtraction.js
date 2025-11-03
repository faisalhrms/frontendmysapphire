import { useQuery } from "@tanstack/react-query"
import { getExtractionsByEmail } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"

export const useEmailExtractions = (emailId, mailbox) => {
  const enabled = !!emailId && !!mailbox
  const { data, isLoading } = useQuery({
    queryKey: ["emailExtractions", emailId, mailbox],
    queryFn: () => getExtractionsByEmail(emailId, mailbox),
    enabled,
    staleTime: 60000,
  })
  return { extractions: Array.isArray(data) ? data : [], isLoading }
}

import { useQuery } from "@tanstack/react-query"
import { getEmailById } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"

export const useAgreementEmail = ({ emailId }) => {
  const enabled = !!emailId
  const { data, isLoading } = useQuery({
    queryKey: ["agreementEmail", emailId],
    queryFn: () => getEmailById(emailId),
    enabled,
    staleTime: 60_000,
  })
  return { email: data || null, isLoading }
}

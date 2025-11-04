import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getThreadMessages } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"

export const useAgreementThread = (email) => {
  const threadKey = useMemo(() => email ? (email.thread_id || email.azure_msg_id) : null, [email])
  const mailbox = email?.mailbox_email || null
  const enabled = !!threadKey && !!mailbox
  const { data, isLoading } = useQuery({
    queryKey: ["agreementThread", threadKey, mailbox],
    queryFn: () => getThreadMessages(threadKey, mailbox),
    enabled,
    staleTime: 60000,
  })
  return { messages: Array.isArray(data) ? data : [], isLoading }
}

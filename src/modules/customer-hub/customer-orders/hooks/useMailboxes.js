import { useEffect, useState, useMemo } from "react"
import { getMailboxes } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"

export const useMailboxes = () => {
  const [mailboxes, setMailboxes] = useState([])
  useEffect(() => {
    getMailboxes().then((list) => setMailboxes(list || []))
  }, [])
  const initialMailbox = useMemo(() => mailboxes[0] || "beirholm.hub@sapphiretextiles.com.pk", [mailboxes])
  return { mailboxes, initialMailbox }
}

import React, { useMemo } from "react"
import { differenceInCalendarDays, parseISO } from "date-fns"
import DataTable from "@components/datatable/DataTable.jsx"
import { toTitleCase } from "@helpers/formatters.js"

const statusLabel = (status, days) => {
  if (status) return status
  if (Number.isNaN(days)) return "-"
  if (days < 0) return "Expired"
  if (days <= 30) return "Expiring soon"
  return "Valid"
}

const statusBadge = (status, days) => {
  if (Number.isNaN(days)) return "badge bg-light text-default"
  if (days < 0) return "badge bg-danger/10 text-danger"
  if (days <= 30) return "badge bg-warning/10 text-warning"
  return "badge bg-success/10 text-success"
}

const expiryBadge = days => {
  if (Number.isNaN(days)) return "badge bg-light text-default"
  if (days < 0) return "badge bg-danger/10 text-danger"
  if (days <= 30) return "badge bg-warning/10 text-warning"
  return "badge bg-success/10 text-success"
}

const CertificateTable = ({ bucket = "expired" }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Business Unit",
        accessor: "business_unit_label",
        Cell: ({ value }) => toTitleCase(value ?? "N/A"),
      },
      {
        Header: "Unit Name",
        accessor: "unit_name",
        Cell: ({ value }) => value || "-",
      },
      {
        Header: "Certificate Name",
        accessor: "certificate_name",
        Cell: ({ value }) => value || "-",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value, row }) => {
          const expiry = row.original.expiry_date
          const days = expiry ? differenceInCalendarDays(parseISO(expiry), new Date()) : Number.NaN
          return (
            <span className={statusBadge(value, days)}>
              {statusLabel(value, days)}
            </span>
          )
        },
      },
      {
        Header: "Date",
        accessor: "expiry_date",
        Cell: ({ value }) => {
          if (!value) {
            return <span className="badge bg-light text-default">-</span>
          }
          const days = differenceInCalendarDays(parseISO(value), new Date())
          return <span className={expiryBadge(days)}>{value}</span>
        },
      },
    ],
    [],
  )

  const apiUrl =
    bucket === "expired"
      ? "chain/certificate-alerts-datatable/?bucket=expired"
      : "chain/certificate-alerts-datatable/?bucket=month"

  return (
    <DataTable
      needHeader={false}
      columns={columns}
      title="Certificates"
      apiUrl={apiUrl}
    />
  )
}

export default CertificateTable

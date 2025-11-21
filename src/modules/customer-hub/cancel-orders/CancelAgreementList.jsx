import React, { useRef, useMemo, useState, useCallback } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { READ_AGREEMENTS } from "@modules/customer-hub/routes.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import {exportReadAgreementsExcel} from "@modules/customer-hub/customer-orders/services/AgreementService.js";

const badge = (v) =>
  v === "completed"
    ? <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">Completed</span>
    : <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">Pending</span>;

const fmtDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "—");

const CancelAgreementList = () => {
  const dataTableRef = useRef();
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleRow = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const columns = useMemo(() => [
    {
      Header: ({ rows }) => {
        const allSelected = rows && rows.length > 0 && rows.every((r) => selectedIds.has(r.original.id));
        const someSelected = rows && rows.some((r) => selectedIds.has(r.original.id));
        return (
          <div className="flex justify-center">
            <input
              type="checkbox"
              className="ti-form-checkbox"
              ref={(el) => {
                if (!el) return;
                el.indeterminate = !allSelected && someSelected;
              }}
              checked={allSelected}
              onChange={() => {
                if (!rows) return;
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  if (allSelected) {
                    rows.forEach((r) => next.delete(r.original.id));
                  } else {
                    rows.forEach((r) => next.add(r.original.id));
                  }
                  return next;
                });
              }}
            />
          </div>
        );
      },
      id: "selection",
      Cell: ({ row }) => {
        const id = row.original.id;
        const checked = selectedIds.has(id);
        return (
          <div className="flex justify-center">
            <input
              type="checkbox"
              className="ti-form-checkbox"
              checked={checked}
              onChange={() => toggleRow(id)}
            />
          </div>
        );
      },
      disableSortBy: true,
      width: 40,
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Link to={`${READ_AGREEMENTS.DETAIL.path}?cancelled=true`}  state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm" title="View Details">
              <i className="ri-eye-2-line" />
            </button>
          </Link>
        </div>
      ),
      disableSortBy: true,
    },
    { Header: "Agreement No.", accessor: "agreement_no" },
    { Header: "Greige Item Code", accessor: "greige_item_code" },
    { Header: "Quality Code", accessor: "quality_code" },
    { Header: "Greige Design", accessor: "greige_design" },
    { Header: "Greige Color", accessor: "greige_color" },
    { Header: "Greige Width", accessor: "greige_width" },
    { Header: "Yarn Status", accessor: "yarn_terms_status", Cell: ({ value }) => badge(value) },
    { Header: "Fabric Delivery status", accessor: "fabric_delivery_status", Cell: ({ value }) => badge(value) },
    { Header: "Need By Date", accessor: "need_by_date", Cell: ({ value }) => fmtDate(value) },
  ], [selectedIds, toggleRow]);

  const handleDownloadExcel = useCallback(async () => {
    const ids = Array.from(selectedIds)
    try {
      const res = await exportReadAgreementsExcel({ ids })
      const blob = res.data
      const disposition = res.headers["content-disposition"] || ""
      let filename = "agreements.xlsx"
      const match = disposition.match(/filename="?([^"]+)"?/)
      if (match && match[1]) filename = match[1]
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      clearSelection()
    } catch (e) {}
  }, [selectedIds, clearSelection])

    const buttons = (
        <div className="flex space-x-2">
            <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                onClick={handleDownloadExcel}
            >
                <i className="ri-file-excel-2-line mr-1"/>
                {selectedIds.size ? "Download Selected" : "Download All"}
            </button>
        </div>
    );
  return (
    <div>
      <PageHeader
        currentpage="Agreement Cancel List"
        activepage="Agreement Cancel read"
        mainpage="Agreement Cancel List"
      />
      <DataTable
        title="Agreement Cancel List"
        ref={dataTableRef}
        columns={columns}
        buttons={buttons}
        apiUrl="customer-hub/agreements/cancel-datatable/"
      />
    </div>
  );
};

export default CancelAgreementList;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FileCheck2 } from "lucide-react";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatDate } from "@helpers/dateTime.js";
import AlertModal from "@components/AlertModal.jsx";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import useGlobalApproval from "@modules/approvals/global/hooks/useGlobalApproval.js";
import api from "@config/axiosConfig.js";

const mapExcelType = (t) => {
  const type = String(t || "").toLowerCase();
  if (type === "date") return "date";
  if (type === "datetime") return "datetime";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  return "string";
};

const renderDynamicValue = (value, type) => {
  if (value == null || value === "") return "-";
  const t = String(type || "").toLowerCase();

  if (t === "boolean") return value ? "Yes" : "No";
  if (t === "date" || t === "datetime") return formatDate(value);

  if (Array.isArray(value)) {
    return value
      .map((v) => (v && typeof v === "object" ? (v.name ?? v.label ?? JSON.stringify(v)) : String(v)))
      .join(", ");
  }

  if (typeof value === "object") return value.name ?? value.label ?? JSON.stringify(value);
  return String(value);
};

const GlobalApprovalList = () => {
  const dataTableRef = useRef();

  const {
    selectedId,
    actionType,
    isModalOpen,
    isSubmitting,
    getModalType,
    getModalTitle,
    getModalMessage,
    getModalButtonText,
    handleActionClick,
    handleSubmit,
    setIsModalOpen,
  } = useGlobalApproval(() => {
    dataTableRef.current?.refetch();
  });

  const [dynamicColsMeta, setDynamicColsMeta] = useState([]);
  const [colsLoaded, setColsLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setColsLoaded(false);

    api
      .get("/approvals/request/columns/", { signal: controller.signal })
      .then((res) => {
        const data = res?.data?.data || [];
        setDynamicColsMeta(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          console.error(err);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setColsLoaded(true);
      });

    return () => controller.abort();
  }, []);

  const baseColumns = useMemo(
    () => [
      {
        Header: "Actions",
        accessor: "id",
        disableSortBy: true,
        Cell: ({ row }) => {
          const hideActions = Boolean(row?.original?.approval_type?.hide_action_buttons);

          return (
            <div className="flex gap-2">
              {!hideActions && (
                <>
                  <button
                    onClick={() => handleActionClick(row.original.id, "approved", row.original.approval_type.label)}
                    className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-500 hover:bg-emerald-600"
                    title="Approve"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleActionClick(row.original.id, "rejected", row.original.approval_type.label)}
                    className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-rose-500 hover:bg-rose-600"
                    title="Reject"
                  >
                    Reject
                  </button>
                </>
              )}

              <Link
                to={row.original.detail_url}
                className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-primary hover:bg-primary"
                title="View"
              >
                View
              </Link>
            </div>
          );
        },
      },
      { Header: "Approval Type", accessor: "approval_type.label" },
      { Header: "Requester", accessor: "requester", Cell: ({ value }) => <UserWithAvatar user={value} /> },
      { Header: "Created At", accessor: "created_at", Cell: ({ value }) => formatDate(value) },
    ],
    [handleActionClick]
  );

  const dynamicColumns = useMemo(() => {
    return (dynamicColsMeta || [])
      .filter((c) => c?.key)
      .map((c) => {
        const key = String(c.key);
        const label = c.label || key;

        return {
          Header: label,
          id: `meta__${key}`,
          disableSortBy: true,
          width: 220,
          minWidth: 120,
          excelColumnType: mapExcelType(c.type),
          accessor: (row) => row?.list_values?.[key],
          Cell: ({ value }) => renderDynamicValue(value, c.type),
        };
      });
  }, [dynamicColsMeta]);

  const columns = useMemo(() => {
    const cols = [...baseColumns];
    const approvalTypeIndex = cols.findIndex((c) => c.accessor === "approval_type.label");
    const insertAt = approvalTypeIndex >= 0 ? approvalTypeIndex + 1 : 1;
    cols.splice(insertAt, 0, ...dynamicColumns);
    return cols;
  }, [baseColumns, dynamicColumns]);

  return (
    <>
      <IconPageHeader heading="Global Approvals" description="Approve or Reject Approval." icon={FileCheck2} />

      {colsLoaded ? (
        <DataTable
          ref={dataTableRef}
          columns={columns}
          apiUrl="/approvals/request/"
          needHeader={false}
          enableAdvancedFilters={false}
        />
      ) : (
        <div className="box custom-box">
          <div className="box-body py-8 text-center text-sm text-gray-500">Loading columns…</div>
        </div>
      )}

      {selectedId && (
        <AlertModal
          id="objective-approval"
          isOpen={isModalOpen}
          type={getModalType(actionType)}
          title={getModalTitle(actionType)}
          message={getModalMessage(actionType)}
          btnTxt={getModalButtonText(actionType)}
          isSubmitting={isSubmitting}
          needInput={true}
          inputLabel="Remarks"
          onConfirm={handleSubmit}
          onClose={setIsModalOpen}
        />
      )}
    </>
  );
};

export default GlobalApprovalList;

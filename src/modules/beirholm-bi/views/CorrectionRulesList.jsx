import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js";
import {
  downloadErrorCorrection,
  deleteErrorCorrectionById,
  downloadCorrectionTemplate,
  getUploadUpdatesStatus,
  getActiveUploadUpdatesJob,
} from "@modules/beirholm-bi/services/CorrectionRulesService.js";
import ConfirmDeleteModal from "@modules/beirholm-bi/components/ConfirmDeleteModal.jsx";
import UploadCorrectionUpdatesModal from "@modules/beirholm-bi/components/UploadCorrectionUpdatesModal.jsx";
import ProgressBar from "@components/ProgressBar.jsx";

const StatusPill = ({ status }) => {
  const s = (status || "").toUpperCase();
  const cls = useMemo(() => {
    const base = "inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium";
    const map = {
      COMPLETED: "bg-success/10 text-success",
      FAILED: "bg-danger/10 text-danger",
      PROCESSING: "bg-info/10 text-info",
      PENDING: "bg-warning/10 text-warning",
    };
    const fallback = "bg-gray/10 text-gray-600 dark:text-white/70";
    return `${base} ${map[s] || fallback}`;
  }, [s]);
  return <span className={cls}>{s || "UNKNOWN"}</span>;
};


const CorrectionRulesList = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTemplateDownloading, setIsTemplateDownloading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [tableKey, setTableKey] = useState(Date.now());
  const refreshTable = () => setTableKey(Date.now());

    useEffect(() => {
      (async () => {
        const active = await getActiveUploadUpdatesJob();
        if (active?.job_id) {
          setJobId(active.job_id);
          setJob(active);
        }
      })();
    }, []);

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const s = await getUploadUpdatesStatus(jobId);
        if (cancelled) return;
        setJob(s);

        const done = s?.status === "COMPLETED" || s?.status === "FAILED";
        if (done) {
          setTimeout(() => {
            setJobId(null);
            setJob(null);
            refreshTable();
          }, 300);
        }
      } catch {
        if (!cancelled) {
          setJobId(null);
          setJob(null);
        }
      }
    };

    const t = setInterval(poll, 1200);
    poll();
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [jobId]);

  const downloadExcel = async () => {
    setIsDownloading(true);
    try {
      const data = await downloadErrorCorrection();
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const filename = `correction_rules_${new Date().toISOString().slice(0, 10)}.xlsx`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadTemplate = async () => {
    setIsTemplateDownloading(true);
    try {
      const data = await downloadCorrectionTemplate();
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "correction_rules_template.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsTemplateDownloading(false);
    }
  };
  const closeConfirmModal = () => {
    setDeleteId(null);
    setIsConfirmModalOpen(false);
  };
  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link to={BEIRHOLM_BI_ROUTES.CORRECTION_RULE_CREATE.path} state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm" title="Edit">
              <i className="ri-edit-line" />
            </button>
          </Link>
          <button
            onClick={() => { setDeleteId(row.original.id); setIsConfirmModalOpen(true); }}
            className="ti-btn ti-btn-danger ti-btn-sm"
            title="Delete"
          >
            <i className="ri-delete-bin-line" />
          </button>
        </div>
      ),
    },
    { Header: "Header Name", accessor: "field_definition.header.name" },
    { Header: "Error Value", accessor: "error_value" },
    { Header: "Sanitized Value", accessor: "sanitized_data.name" },
  ];

  const buttons = (
    <>
      <div className="flex space-x-2 items-center">
        <Link
          to={BEIRHOLM_BI_ROUTES.CORRECTION_RULE_CREATE.path}
          className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
          title="Add Rule"
        >
          <i className="ri-add-line font-semibold align-middle" />
        </Link>

        <button
          type="button"
          onClick={downloadExcel}
          disabled={isDownloading}
          className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
          title="Download Correction Rules"
        >
          {isDownloading ? <i className="ri-file-excel-2-line animate-spin" /> : <i className="ri-file-excel-2-line" />}
        </button>

        <button
          type="button"
          onClick={downloadTemplate}
          disabled={isTemplateDownloading}
          className="hs-dropdown-toggle ti-btn ti-btn-info-full !py-1 !px-2 !text-[0.75rem]"
          title="Download Sample Template"
        >
          {isTemplateDownloading ? <i className="ri-download-2-line animate-spin" /> : <i className="ri-download-2-line" />}
        </button>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          disabled={!!jobId}
          className="hs-dropdown-toggle ti-btn ti-btn-warning-full !py-1 !px-2 !text-[0.75rem]"
          title="Upload Updates"
        >
          {jobId ? <i className="ri-upload-cloud-2-line animate-pulse" /> : <i className="ri-upload-cloud-2-line" />}
        </button>

        {job && (
          <div className="flex items-center gap-3 ml-2">
            <StatusPill status={job.status} />
            <div className="w-56">
              <ProgressBar
                value={job.progress ?? 0}
                status=""
                withStatus={false}
                barColor="bg-primary"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                rows updated: {job.updated_rows ?? 0}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <PageHeader currentpage="Correction Rules" mainpage="Correction Rules" />
      <DataTable
        key={tableKey}
        columns={columns}
        title="Correction Rules"
        apiUrl="error/correction/rule/datatable/"
        buttons={buttons}
      />

      {isConfirmModalOpen && deleteId && (
        <ConfirmDeleteModal
          bodyMessage="Are you sure you want to delete this rule, its children, and its sanitized value?"
          closeModal={closeConfirmModal}
          onConfirm={async () => {
            await deleteErrorCorrectionById(deleteId);
            refreshTable();
          }}
        />
      )}

      {isUploadModalOpen && (
        <UploadCorrectionUpdatesModal
          title="Upload Correction Rule Updates"
          closeModal={() => setIsUploadModalOpen(false)}
          onUploaded={(payload) => {
            setIsUploadModalOpen(false);
            if (payload?.job_id) {
              setJobId(payload.job_id);
              setJob(payload);
            }
          }}
        />
      )}
    </>
  );
};

export default CorrectionRulesList;

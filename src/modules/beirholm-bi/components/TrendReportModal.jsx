import React, { useEffect, useState } from "react";
import DataSanitizeService from "@modules/beirholm-bi/services/DataSanitizeService.js";
import Notify from "@helpers/toastNotifications.js";

const TrendReportModal = ({ closeModal }) => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    DataSanitizeService.fetchTrendReportPreviewHtml()
      .then((h) => {
        if (mounted) setHtml(h || "");
      })
      .catch(() => {
        if (mounted) setHtml("");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const onSend = async () => {
    setSending(true);
    try {
      await DataSanitizeService.sendTrendReport();
      Notify.success("Trend report sent.");
      closeModal();
    } catch (e) {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Trend Report Preview</div>
          <button className="ti-btn ti-btn-light ti-btn-sm" onClick={closeModal}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="p-6 text-center">
              <i className="ri-loader-2-line animate-spin"></i>
            </div>
          ) : (
            <iframe
              title="trend-report"
              style={{ width: "100%", height: "75vh", border: 0 }}
              srcDoc={html}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button className="ti-btn ti-btn-light" onClick={closeModal} disabled={sending}>
            Close
          </button>
          <button className="ti-btn ti-btn-primary" onClick={onSend} disabled={sending || loading}>
            {sending ? <i className="ri-loader-2-line animate-spin"></i> : <i className="ri-send-plane-2-line"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendReportModal;

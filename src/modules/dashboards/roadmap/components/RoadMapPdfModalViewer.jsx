import React from "react";
import { useSecureMedia } from "@modules/media/hooks/mediaHooks.js";
import PdfModalViewerBase from "@modules/dashboards/roadmap/components/PdfModalViewerBase.jsx";

const RoadMapPdfModalViewer = ({ isOpen, fileId, onClose, isConfidential = true }) => {
  const { blobUrl, mimeType, loading } = useSecureMedia(fileId, isOpen);

  return (
    <PdfModalViewerBase
      isOpen={isOpen}
      fileUrl={blobUrl}
      mimeType={mimeType}
      loading={loading}
      onClose={onClose}
      title="Secure Document Viewer"
      subtitle={mimeType?.startsWith("image/") ? "Image File" : "PDF Document"}
      isConfidential={isConfidential}
    />
  );
};

export default RoadMapPdfModalViewer;

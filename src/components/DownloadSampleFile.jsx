import React from "react";

export const DownloadSampleFile = ({ downloadFn, title = 'Download', className = '' }) => {
  const handleDownload = async () => {
    try {
      await downloadFn();
    } catch (error) {
      console.error(`${title} failed`, error);
    }
  };

  return (
    <button onClick={handleDownload} className={`ti-btn ${className}`} title={title}>
       <i className="ri-download-2-line" />
    </button>
  );
};

export default DownloadSampleFile;

import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Logo from "@assets/images/company-logos/sapphire.png";
import { QRCodeCanvas } from "qrcode.react";
import QRCode from "qrcode";

const ProfileCard = ({ isLoading, errorMessage, filteredData }) => {
  const qrValue = filteredData ? `${window.location.origin}${filteredData.profile_url}` : "";
  const downloadQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(qrValue, { width: 128 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qr-code.png";
      link.click();
    } catch (error) {
      console.error("Error generating QR Code", error);
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : errorMessage ? (
    <div className="flex flex-col items-center">
      <p className="text-red-500 text-lg">{errorMessage}</p>
    </div>
  ) : (
    <div className="flex flex-col items-center space-y-6 mt-10 mb-10 rounded-3xl">
      <div className="bg-white shadow-lg border border-gray-500 rounded-sm p-6 w-[600px] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0c4c91" }}>
            {filteredData?.name}
          </h1>
          <p className="text-sm text-gray-700">
            {filteredData?.position || "Designation"}
          </p>
          <p className="text-sm text-gray-700">
            {filteredData?.department || "Department"}
          </p>
          <div className="mt-4">
            <p className="text-lg font-semibold" style={{ color: "#0c4c91" }}>
              {filteredData?.phone || "Phone"}
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <p className="flex items-center space-x-2 text-gray-800">
              <i className="ri-mail-line"></i>
              <a href={`mailto:${filteredData?.email}`} style={{ color: "#0c4c91" }}>
                {filteredData?.email}
              </a>
            </p>
            <p className="flex items-center space-x-2 text-gray-800">
              <i className="ri-global-line"></i>
              <a
                href={filteredData?.company?.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0c4c91" }}
              >
                {filteredData?.company?.website}
              </a>
            </p>
            <p className="flex items-center space-x-2 text-gray-800">
              <i className="ri-phone-line"></i>
              <span style={{ color: "#0c4c91" }}>
                {filteredData?.phone || "Phone"}
              </span>
            </p>
          </div>
        </div>
        <div className="text-center">
          <img src={filteredData?.company?.logo?.file_url} alt="Sapphire Logo" className="w-28 mb-8" />
          <div className="border border-gray-300 p-2">
            <QRCodeCanvas id="qrCodeCanvas" value={qrValue} size={100} />
          </div>
          <button onClick={downloadQRCode} className="ti-btn ti-btn-secondary ti-btn-sm mt-3">
            <i className="ri-download-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

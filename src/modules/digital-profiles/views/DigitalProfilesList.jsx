import React, { useEffect, useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { getDigitalProfiles } from "@modules/digital-profiles/services/Service.js";
import { QRCodeCanvas } from "qrcode.react";
import QRCode from "qrcode";

const DigitalProfilesList = () => {
  const [dataArray, setDataArray] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [modalProfile, setModalProfile] = useState(null);

  const fetchAllDigitalProfiles = async () => {
    try {
      const response = await getDigitalProfiles();
      setDataArray(response?.data || response);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchAllDigitalProfiles();
  }, []);

  const openQRModal = (profileRow) => {
    setModalProfile(profileRow);
    setQrModalOpen(true);
  };

  const closeQRModal = () => {
    setQrModalOpen(false);
    setModalProfile(null);
  };

  const downloadQRCode = async (profileRow) => {
    try {
      const fullURL = `${window.location.origin}${profileRow.profile_url}`;
      const dataUrl = await QRCode.toDataURL(fullURL, { width: 128 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "qr-code.png";
      a.click();
    } catch (error) {
    }
  };

  const columns = [
    {
      Header: "QR Code",
      Cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => openQRModal(rowData)}
              className="ti-btn ti-btn-secondary ti-btn-sm"
            >
              <i className="ri-eye-line"></i>
            </button>
            <button
              onClick={() => downloadQRCode(rowData)}
              className="ti-btn ti-btn-secondary ti-btn-sm"
            >
              <i className="ri-download-line"></i>
            </button>
          </div>
        );
      },
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link to="/module/digital/profiles/add" state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      ),
    },
    { Header: "Full Name", accessor: "name" },
    {
      Header: "Position",
      accessor: "position",
      Cell: ({ value }) => toTitleCase(value),
    },
    {
      Header: "Company",
      accessor: "company",
      Cell: ({ value }) => value?.name || "",
    },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "address" },
  ];

  const buttons = (
    <div className="grid grid-cols-1 sm:grid-cols-1">
      <Link
        to="/module/digital/profiles/add"
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line font-semibold align-middle"></i> Add
      </Link>
    </div>
  );

  return (
    <>
      <PageHeader currentpage="Digital Profiles" mainpage="Digital Profiles" />
      <DataTable
        columns={columns}
        title="Digital Profiles"
        apiUrl="digital_profiles/datatable/"
        buttons={buttons}
      />
      {qrModalOpen && modalProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <QRCodeCanvas
              value={`${window.location.origin}${modalProfile.profile_url}`}
              size={128}
            />
            <div className="mt-4 flex space-x-2 justify-end">
              <button
                onClick={() => downloadQRCode(modalProfile)}
                className="ti-btn ti-btn-secondary ti-btn-sm"
              >
                <i className="ri-download-line"></i>
              </button>
              <button
                onClick={closeQRModal}
                className="ti-btn ti-btn-secondary ti-btn-sm"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DigitalProfilesList;

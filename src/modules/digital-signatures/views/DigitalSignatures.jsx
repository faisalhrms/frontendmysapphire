import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SignatureForm from "../component/SignaturesForm";
import SocialSignature from "../component/SocialSignatures";
import TemplateSignature from "../component/TemplateSignature";
import SavedSignature from "../component/SavedSignature";
import axios from "axios";
import { getSignature, saveSignature } from "../services/Service";

const DigitalSignatures = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [data, setData] = useState({});
  const [editData, setEditData] = useState(null);
  const [hide, setHide] = useState(false);

  console.log("check", hide);

  const handleHide = () => {
    try {
      setHide(!hide);
    } catch (error) {
      console.error("Error toggling hide:", error);
    }
  };

  const handleSubmitData = async (data1, step) => {
    try {
      console.log("Incoming data1:", data1);
      const updatedData = { ...data, ...data1 };

      console.log("Updated data:", updatedData);

      if (!updatedData?.employee_code) {
        console.error("Employee code is undefined in the updated data.");

        return;
      }

      setData(updatedData);

      if (step === 1) {
        setActiveTab("social");
      } else if (step === 2) {
        try {
          await saveSignature({ ...updatedData, company_id: 1 });
          const savedData = await getSignature(updatedData.employee_code);
          console.log("Saved data fetched successfully:", savedData);
        } catch (error) {
          console.error("Error handling submit data:", error);
        }
      }
    } catch (error) {}
  };

  const handleSavedDataFetch = async (Code, step) => {
    try {
      console.log(Code, step);
      setActiveTab("details");
      const data = await getSignature(Code);
      setEditData(data);
    } catch (error) {
      console.error("Error fetching saved data:", error);
    }
  };

  const saveSignature = async (data) => {
    console.table(data);
    try {
      const response = await api.post("/signatures/", data);
      return response;
    } catch (error) {}
  };

  const downloadAllScripts = async () => {
    try {
      const response = await axios.get(`/signatures/download-all`, {
        responseType: "blob",
      });

      if (!response || !response.data) {
        throw new Error("No file data received from the server.");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : "all_signatures_scripts.zip";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <>
      <PageHeader
        currentpage="Digital Signatures"
        activepage="Digital Signatures"
        mainpage="SignaturesForm"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box">
            <div className="box-header flex flex-col sm:flex-row justify-between items-center w-full p-4 rounded-md">
              <nav
                aria-label="Tabs"
                className="md:flex block !justify-start whitespace-nowrap"
              >
                {/* Tabs */}
                <button
                  onClick={() => setActiveTab("details")}
                  className={`m-1 block w-full ${
                    activeTab === "details"
                      ? "bg-primary/10 text-primary"
                      : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  } cursor-pointer py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`m-1 block w-full ${
                    activeTab === "social"
                      ? "bg-primary/10 text-primary"
                      : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  } cursor-pointer py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md`}
                >
                  Social
                </button>
                <button
                  onClick={() => setActiveTab("template")}
                  className={`m-1 block w-full ${
                    activeTab === "template"
                      ? "bg-primary/10 text-primary"
                      : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  } cursor-pointer py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md`}
                >
                  Template
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`m-1 block w-full ${
                    activeTab === "saved"
                      ? "bg-primary/10 text-primary"
                      : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  } cursor-pointer py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md`}
                >
                  Saved
                </button>
              </nav>
              {activeTab === "saved" && (
                <div className="flex right">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md bg-primary flex items-center gap-2 hover:bg-primary-dark"
                    onClick={downloadAllScripts}
                  >
                    <i className="bx bxs-download"></i>
                    All Download
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="tab-content grid grid-cols-12 gap-6 w-full">
            {activeTab === "details" && (
              <div
                className="tab-pane col-span-12 md:col-span-12 show active"
                id="details"
                aria-labelledby="details"
                role="tabpanel"
              >
                <SignatureForm
                  handleSubmitData={handleSubmitData}
                  editData={editData}
                  hide={hide}
                  handleHide={handleHide}
                />
              </div>
            )}

            {activeTab === "social" && (
              <div
                className="tab-pane col-span-12 md:col-span-12"
                id="social"
                aria-labelledby="social"
                role="tabpanel"
              >
                <SocialSignature
                  handleSubmitData={handleSubmitData}
                  editData={editData}
                />
              </div>
            )}

            {activeTab === "template" && (
              <div
                className="tab-pane col-span-12 md:col-span-12"
                id="template"
                aria-labelledby="template"
                role="tabpanel"
              >
                <TemplateSignature handleHide={handleHide} />
              </div>
            )}

            {activeTab === "saved" && (
              <div
                className="tab-pane col-span-12"
                id="saved"
                aria-labelledby="saved"
                role="tabpanel"
              >
                <SavedSignature handleSavedDataFetch={handleSavedDataFetch} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DigitalSignatures;

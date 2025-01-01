import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SignatureForm from "../component/SignaturesForm";
import SocialSignature from "../component/SocialSignatures";
import TemplateSignature from "../component/TemplateSignature";
import SavedSignature from "../component/SavedSignature";
import axios from "axios";

const DigitalSignatures = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [data, setData] = useState({});
  const [editData, setEditData] = useState(null);

  const handleSubmitData = async (data1, step) => {
    setData({ ...data, ...data1 });
    if (step === 1) {
      setActiveTab("social");
    } else if (step === 2) {
      await saveSignature({ ...data, ...data1, company_id: 1 });
      const savedData = await getSignature(data?.employee_code);
      console.log("savedData", savedData);
    }
  };

  const handleSavedDataFetch = async (Code, step) => {
    try {
      console.log(Code, step);
      setActiveTab("details");
      const data = await getSignatureByEmpCode(Code);
      setEditData(data);
    } catch (error) {
      console.error("Error fetching saved data:", error);
    }
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
            <div className="box-header sm:flex block !justify-start">
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
                {activeTab === "saved" && (
                  <div className="flex right">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md bg-primary flex items-center gap-2 bx bx-down-arrow-althover:bg-primary-dark"
                      onClick={downloadAllScripts}
                    >
                      Download All Scripts
                    </button>
                  </div>
                )}
              </nav>
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
                <TemplateSignature />
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

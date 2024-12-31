import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SignatureForm from "../component/SignaturesForm";
import SocialSignature from "../component/SocialSignatures";
import TemplateSignature from "../component/TemplateSignature";
import SavedSignature from "../component/SavedSignature";
import {
  getDownloadAll,
  getSignature,
  getSignatureByEmpCode,
  saveSignature,
} from "../services/Service";

const DigitalSignatures = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [data, setData] = useState({});
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleSubmitData = async (data1, step) => {
    setData({ ...data, ...data1 });
    if (step == 1) {
      setActiveTab("social");
    } else if (step == 2) {
      await saveSignature({ ...data, ...data1, company_id: 1 });
      const savedData = await getSignature(data?.employee_code);
      await setActiveTab("saved");
      setIsEdit(false);
      console.log("savedData", savedData);
    }
  };

  const handleSavedDataFetch = async (Code, step, edit = false) => {
    try {
      const data = await getSignatureByEmpCode(Code);
      console.log(data);
      setEditData(data);
      setIsEdit(true);
      await setActiveTab("details");
    } catch (error) {}
  };


  const handleDownload = async()=>{
    try {
      const res = await getDownloadAll();
      
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <PageHeader
        currentpage="Digital Signatures"
        activepage="Digital Signatures"
        mainpage="SignaturesForm"
      />
      <div className="grid grid-cols-12 gap-6 ">
        <div className="xl:col-span-12 col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center w-full p-4 rounded-md">
              {/* Navigation */}
              <nav aria-label="Tabs" className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`m-1 px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "details"
                      ? "bg-primary/10 text-primary"
                      : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`m-1 px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "social"
                      ? "bg-primary/10 text-primary"
                      : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  }`}
                >
                  Social
                </button>
                <button
                  onClick={() => setActiveTab("template")}
                  className={`m-1 px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "template"
                      ? "bg-primary/10 text-primary"
                      : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  }`}
                >
                  Template
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`m-1 px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "saved"
                      ? "bg-primary/10 text-primary"
                      : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  }`}
                >
                  Saved
                </button>
              </nav>

              {/* Right-Aligned Button */}
              {activeTab == "saved" && (
                <div>
                  <button className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary focus:outline-none shadow-md transition duration-200"
                  onClick={handleDownload}
                  >
                    {/* Download Icon */}
                    <i className="bx bxs-download mr-2 text-lg"></i>
                    {/* Button Text */}
                    Download
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
                className="tab-pane col-span-12 "
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

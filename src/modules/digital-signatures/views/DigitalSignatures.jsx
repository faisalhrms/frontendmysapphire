import React, {useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SignatureForm from "../component/SignaturesForm";
import SocialSignature from "../component/SocialSignatures";
import TemplateSignature from "../component/TemplateSignature";
import SavedSignature from "../component/SavedSignature";
import axios from "axios";
import {getSignature, saveSignature, updateSignature} from "../services/Service";
import Notify from "@helpers/toastNotifications.js";
import api from "@config/axiosConfig.js";

const DigitalSignatures = () => {
    const [activeTab, setActiveTab] = useState("details");
    const [data, setData] = useState({});
    const [editData, setEditData] = useState({});
    const [hide, setHide] = useState(false);
    const [tempStep, setTempStep] = useState(1);

    console.log("check", tempStep);

    const handleHide = () => {
        try {
            setHide(!hide);
        } catch (error) {
            console.error("Error toggling hide:", error);
        }
    };

    const handleChangeTemplate = (step) => {
        setTempStep(step);
    };

    const handleSubmitData = async (data1, step) => {
        try {
            const updatedData = {...editData, ...data1};

            if (!updatedData?.employee_code) {
                Notify.error("Employee code is undefined in the updated data.");
                return;
            }

            setData(updatedData);
            setEditData(updatedData);

            if (step === 1) {
                setActiveTab("social");
            } else if (step === 2) {
                try {
                    console.log("Saving or updating signature data...");
                    let saveResponse;
                    if (editData?.id) {
                        saveResponse = await updateSignature(updatedData.employee_code, updatedData);
                    } else {
                        saveResponse = await saveSignature(updatedData);
                    }

                    if (saveResponse) {
                        Notify.success("Signature data saved successfully.");
                        const savedData = await getSignature(updatedData.employee_code);
                        setData(savedData);
                        console.log("Saved data fetched successfully:", savedData);
                    } else {
                        Notify.error("Failed to save signature data.");
                    }
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message ||
                        Object.entries(error.response?.data || {})
                            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                            .join(" | ") ||
                        error.message ||
                        "An unexpected error occurred.";
                    console.error("Error saving signature data:", errorMessage);
                    Notify.error(errorMessage);
                }
            }
        } catch (error) {
            Notify.error("An unexpected error occurred. Please try again.");
            console.error("Error in handleSubmitData:", error);
        }
    };


    console.log(data);

    const handleSavedDataFetch = async (Code, step) => {
        try {
            console.log(Code, step);
            setActiveTab("details");
            const data = await getSignature(Code);
            console.log(data);
            setEditData(data);
        } catch (error) {
            console.error("Error fetching saved data:", error);
        }
    };


const downloadAllScripts = async () => {
    try {
        const response = await api.get('/signatures/download-all/', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'all_signatures_scripts.zip');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading scripts:", error);
        Notify.error("Failed to download scripts. Please try again.");
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
                        <div
                            className="box-header flex flex-col sm:flex-row justify-between items-center w-full p-2 rounded-md">
                            <nav
                                aria-label="Tabs"
                                className="md:flex block !justify-start whitespace-nowrap"
                            >
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
                                    tempStep={tempStep}
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
                                    tempStep={tempStep}
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
                                <TemplateSignature
                                    handleHide={handleHide}
                                    editData={editData}
                                    handleChangeTemplate={handleChangeTemplate}
                                    tempStep={"all"}
                                />
                            </div>
                        )}

                        {activeTab === "saved" && (
                            <div
                                className="tab-pane col-span-12"
                                id="saved"
                                aria-labelledby="saved"
                                role="tabpanel"
                            >
                                <SavedSignature handleSavedDataFetch={handleSavedDataFetch}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DigitalSignatures;

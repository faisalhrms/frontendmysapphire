
import React, {useEffect, useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SrTypeForm from "@modules/setup/components/SrTypeForm.jsx";
import SrsubTypesForm from "@modules/setup/components/SrsubTypes.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const SrTypes = () => {
    const [activeTab, setActiveTab] = useState("sr-types");

    const router = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};
    const  [saveData, setSaveData] = useState({});
    console.log(saveData);

    const handleFetch = async(id)=>{
        try {
            const response = await api.get(`/setups/service-requests/${id}/`);
            const data = await response?.data?.data;
            setSaveData(data);
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to update Service Request");
            throw error;
        }
    }

    useEffect(()=>{
        if(id){
            handleFetch(id)
        }
    },[id])

    const handleSubmitData = async(formData,step) => {
        try{

            console.log(step)
            if(step!=undefined){
                setSaveData(formData);
                try {
                    if(id){
                        const response = await api.put(`/setups/service-requests/${id}/`, {...formData})
                        Notify.success("Successfully updated Service Request");
                        router("/module/sr")
                    }else{
                        const response = await api.post(`/setups/service-requests/`,saveData)
                        Notify.success("Successfully Created ..!");
                        router("/module/sr")
                    }
                }catch(error){

                }

            }else{
                console.log("Submitting Form Data:", formData);
                setSaveData((prevData) => ({
                    ...prevData, // Spread the previous state
                    ...formData, // Merge the new data
                }));

                setActiveTab("sr-type-assignment")
            }
        }catch(error){
console.log(error)
        }
    }

    return (
        <>
            <PageHeader currentpage="Sr Types" />
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header sm:flex block !justify-start">
                            <nav
                                aria-label="Tabs"
                                className="md:flex block !justify-start whitespace-nowrap"
                            >
                                <button
                                    className={`m-1 block w-full ${
                                        activeTab === "sr-types"
                                            ? "bg-primary/10 text-primary"
                                            : "text-defaulttextcolor"
                                    } dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md hover:text-primary`}
                                    onClick={() => setActiveTab("sr-types")}
                                >
                                    Sr Types
                                </button>
                                <button
                                    className={`m-1 block w-full ${
                                        activeTab === "sr-type-assignment"
                                            ? "bg-primary/10 text-primary"
                                            : "text-defaulttextcolor"
                                    } dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md hover:text-primary`}
                                    onClick={() => setActiveTab("sr-type-assignment")}
                                >
                                    Sr Type Assignment
                                </button>

                            </nav>
                        </div>
                        <div className="box-body">
                            {activeTab === "sr-types" && (
                                <div className="tab-pane show active" role="tabpanel">
                                    <SrTypeForm saveData={saveData} handleSubmitData={handleSubmitData}/>
                                </div>
                            )}
                            {activeTab === "sr-type-assignment" && (
                                <div className="tab-pane show active" role="tabpanel">
                                    <SrsubTypesForm saveData={saveData} handleSubmitData={handleSubmitData}/>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SrTypes;

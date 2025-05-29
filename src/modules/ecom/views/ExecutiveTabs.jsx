import React, { useState, useMemo, useCallback, useEffect } from "react";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import {useFetchWithFilters, usePostWithFilters} from "@hooks/useFetchWithFilters.js";
import api from "../../../config/axiosConfig.js";
import IconTabs from "@components/IconTabs.jsx";
import EcomReconciliation from "../components/EcomSalesForce/EcomReconciliation.jsx";
import AgingForm from "../components/SalesforceDashboard/AgingForm.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import DigitalDate from "@modules/ecom/components/DigitalSpent/Digitaldate.jsx";
import SaleForceDates from "@modules/ecom/components/SalesforceDashboard/SaleForceDates.jsx";
import ExecutiveForm from "@modules/ecom/components/SalesforceDashboard/ExecutiveForm.jsx";

const EcomSaleforce = () => {
    const [activeTab, setActiveTab] = useState("executiveSummary");
    const [currentDate, setCurrentDate] = useState("");
    const [showsynctime, setshowsynctime] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchSyncTime = async () => {
        try {
            const response = await api.post('/salesforce/fetch_sync_time_cc/');
            setshowsynctime(response.data.data.show_sync_time)
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setErrorMessage("The data was last updated on Feb 25, 2025 - 04:15 PM");
                } else {
                    setErrorMessage(`Error fetching sync time: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
                }
            } else if (error.request) {

                setErrorMessage("No response from the server. Please check your connection.");
            } else {

                setErrorMessage(`Error: ${error.message}`);
            }
            console.error("Error fetching sync time:", error);
        }
    };
    useEffect(() => {
        fetchSyncTime();
    }, []);


    useEffect(() => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        setCurrentDate(`${day}-${month}-${year}`);
    }, []);


    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(() => ({
            initialFilters: [
                {
                    name: 'date_from',
                    defaultValue: new Date("2025-01-21").toISOString().slice(0, 10)
                },
                {
                    name: 'date_to',
                    defaultValue: new Date().toISOString().slice(0, 10)
                },
            ],
        }), [])
    );

    const [filters, setFilters] = useState(getFilters());


    const { data: executiveData, isLoading: executiveLoading } = useFetchWithFilters(
        activeTab === "executiveSummary"?"/salesforce/fetch_executive_summary/":
            activeTab === "agingLiabilities"?"/salesforce/fetch_pending_orders/":'',

        filters,
    );



    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const handleTabChange = useCallback((tabId) => {
        setActiveTab(tabId);
    }, []);




    return (
        <>
            <PageHeader currentpage="Salesforce Dashboard"  activepage="Executive Summary" mainpage="Salesforce Dashboard"/>


            <form onSubmit={handleSubmit(onSubmit)}>
                <SaleForceDates control={control} errors={errors} filters={filters} activeTab={activeTab} handleSubmit={handleSubmit} onSubmit={onSubmit} currentDate={currentDate}/>
            </form>


            <IconTabs
                tabs={[
                    {
                        id: "executiveSummary",
                        label: "Executive Summary",
                        icon: <i className="bx bx-pie-chart-alt"></i>,
                        content: (
                            <>
                                {showsynctime && (
                                    <div className="error-message text-primary p-2 rounded-lg text-right text-black ">
                                        <p>{showsynctime}</p>
                                    </div>
                                )}


                                {errorMessage && (
                                    <div className="error-message alert alert-primary  p-2 rounded-lg shadow-md text-center text-black mb-2">
                                        <p>{errorMessage}</p>
                                    </div>
                                )}
                                <ExecutiveForm filters={filters}  data={executiveData}
                                               isLoading={executiveLoading}/>
                            </>

                        ),
                    },
                    {
                        id: "agingLiabilities",
                        label: "Aging’s for Pending Liabilities",
                        icon: <i className="bx bx-time-five"></i>,
                        content: (
                            <div className="">
                                {showsynctime && (
                                    <div className="error-message text-primary p-2 rounded-lg text-right text-black ">
                                        <p>{showsynctime}</p>
                                    </div>
                                )}


                                {errorMessage && (
                                    <div className="error-message alert alert-primary  p-2 rounded-lg shadow-md text-center text-black mb-2">
                                        <p>{errorMessage}</p>
                                    </div>
                                )}
                                <AgingForm
                                    pendingOrdersData={executiveData}
                                    loadingOrders={executiveLoading}
                                    filters={filters}
                                    activeTab={activeTab}
                                />
                            </div>
                        ),
                    },
                ]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default EcomSaleforce;
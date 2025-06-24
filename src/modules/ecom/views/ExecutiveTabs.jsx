import React, { useState, useMemo, useCallback } from "react";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import IconTabs from "@components/IconTabs.jsx";

import AgingForm from "../components/SalesforceDashboard/AgingForm.jsx";
import SaleForceDates from "@modules/ecom/components/SalesforceDashboard/SaleForceDates.jsx";
import ExecutiveForm from "@modules/ecom/components/SalesforceDashboard/ExecutiveForm.jsx";
import useSalesforceSyncTime from "@modules/ecom/hooks/useSalesforceSyncTime.js";

const EcomSaleforce = () => {
    const [activeTab, setActiveTab] = useState("executiveSummary");
    const [currentDate, setCurrentDate] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [isModelLoading, setIsModelLoading] = useState(false);

    const { syncTime, errorMessage, refetch } = useSalesforceSyncTime();

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

    const { data: executiveData, isLoading: executiveLoading, refetch: originalRefetch } = useFetchWithFilters(
        activeTab === "executiveSummary" ? "/salesforce/fetch_executive_summary/" :
            activeTab === "agingLiabilities" ? "/salesforce/fetch_pending_orders/" : '',
        filters
    );

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const handleTabChange = useCallback((tabId) => {
        setActiveTab(tabId);
    }, []);


    const handleRefetch = async () => {
        setIsModelLoading(true);
        try {

            const refreshedData = await refetch(filters, activeTab);


            await originalRefetch();

            console.log("Refetch completed successfully", refreshedData);
        } catch (error) {
            console.error("Error during refetch:", error);
        } finally {
            setIsModelLoading(false);
        }
    };

    return (
        <>
            <PageHeader currentpage="Salesforce Dashboard" activepage="Executive Summary" mainpage="Salesforce Dashboard"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SaleForceDates
                    refetch={handleRefetch}
                    control={control}
                    errors={errors}
                    filters={filters}
                    activeTab={activeTab}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    currentDate={currentDate}
                    isLoading={isModelLoading}
                />
            </form>

            <IconTabs
                tabs={[
                    {
                        id: "executiveSummary",
                        label: "Executive Summary",
                        icon: <i className="bx bx-pie-chart-alt"></i>,
                        content: (
                            <>
                                {syncTime && (
                                    <div className="error-message text-primary p-2 rounded-lg text-right text-black">
                                        <p>{syncTime}</p>
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="error-message alert alert-primary p-2 rounded-lg shadow-md text-center text-black mb-2">
                                        <p>{errorMessage}</p>
                                    </div>
                                )}
                                <ExecutiveForm
                                    filters={filters}
                                    syncTime={syncTime}
                                    data={executiveData}
                                    refetch={handleRefetch}
                                    isLoading={executiveLoading || isModelLoading}
                                />
                            </>
                        ),
                    },
                    {
                        id: "agingLiabilities",
                        label: "Aging for Pending Liabilities",
                        icon: <i className="bx bx-time-five"></i>,
                        content: (
                            <div>
                                {syncTime && (
                                    <div className="error-message text-primary p-2 rounded-lg text-right text-black">
                                        <p>{syncTime}</p>
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="error-message alert alert-primary p-2 rounded-lg shadow-md text-center text-black mb-2">
                                        <p>{errorMessage}</p>
                                    </div>
                                )}
                                <AgingForm
                                    pendingOrdersData={executiveData}
                                    loadingOrders={executiveLoading || isModelLoading}
                                    filters={filters}
                                    activeTab={activeTab}
                                    refetch={handleRefetch}
                                />


                                <button
                                    onClick={handleRefetch}
                                    disabled={isModelLoading}
                                    className="btn btn-primary mt-3"
                                >
                                    {isModelLoading ? "Refreshing..." : "Refresh Data"}
                                </button>
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
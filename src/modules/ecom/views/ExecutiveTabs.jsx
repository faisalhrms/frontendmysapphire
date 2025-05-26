// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "react-datepicker/dist/react-datepicker.css";
//
// import PageHeader from "../../layouts/includes/PageHeader.jsx";
// import ExecutiveForm from "../components/SalesforceDashboard/ExecutiveForm.jsx";
// import AgingForm from "../components/SalesforceDashboard/AgingForm.jsx";
// import FormInput from "@components/form/FormInput.jsx";
// import useFilters from "@hooks/useFilters.js";
// import FilterButton from "@components/form/FilterButton.jsx";
// import axios from 'axios';
// import api from "../../../config/axiosConfig.js";
//
// const ExecutiveTabs = () => {
//     const [activeTab, setActiveTab] = useState("executiveSummary");
//     const [showFilters, setShowFilters] = useState(false);
//     const [currentDate, setCurrentDate] = useState("");
//     const [showsynctime, setshowsynctime] = useState("");
//     const [errorMessage, setErrorMessage] = useState("");
//
//     const {
//         control,
//         handleSubmit,
//         errors,
//         getFilters
//     } = useFilters(
//         useMemo(
//             () => ({
//                 initialFilters: [
//                     { name: 'date_from', defaultValue: new Date("2025-01-21").toISOString().slice(0, 10) },
//                     { name: 'date_to', defaultValue: new Date().toISOString().slice(0, 10) },
//                 ],
//             }),
//             []
//         )
//     );
//
//     const [filters, setFilters] = useState(getFilters());
//
//     const onSubmit = useCallback(
//         (formData) => {
//             setFilters(formData);
//         },
//         []
//     );
//
//
//     useEffect(() => {
//         const fetchSyncTime = async () => {
//             try {
//                 const response = await api.post('/salesforce/fetch_sync_time_cc/');
//                 setshowsynctime(response.data.data.show_sync_time)
//             } catch (error) {
//                 if (error.response) {
//                     if (error.response.status === 404) {
//                         setErrorMessage("The data was last updated on Feb 25, 2025 - 04:15 PM");
//                     } else {
//                         setErrorMessage(`Error fetching sync time: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
//                     }
//                 } else if (error.request) {
//
//                     setErrorMessage("No response from the server. Please check your connection.");
//                 } else {
//
//                     setErrorMessage(`Error: ${error.message}`);
//                 }
//                 console.error("Error fetching sync time:", error);
//             }
//         };
//         fetchSyncTime();
//     }, []);
//
//
//     useEffect(() => {
//         const date = new Date();
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = date.toLocaleString('default', { month: 'short' });
//         const year = date.getFullYear();
//
//         const formattedDate = `${day}-${month}-${year}`;
//         setCurrentDate(formattedDate);
//     }, []);
//
//     return (
//         <>
//             <PageHeader currentpage="Salesforce Dashboard" />
//
//             <div
//                 className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-4 dark:text-gray-200 dark:bg-bodybg">
//                 <div className="flex space-x-4">
//                     <Link
//                         to="#"
//                         className={`px-4 py-2 border  rounded-md font-medium transition-all dark:text-gray-200 dark:bg-bodybg ${activeTab === "executiveSummary" ? "bg-primary text-white shadow-md" : "bg-gray-200 text-black"}`}
//                         onClick={() => setActiveTab("executiveSummary")}
//                     >
//                         Executive Summary
//                     </Link>
//
//                     <Link
//                         to="#"
//                         className={`px-4 py-2 border  rounded-md font-medium transition-all dark:text-gray-200 dark:bg-bodybg ${activeTab === "agingLiabilities" ? "bg-primary text-white shadow-md" : "bg-gray-200 text-black"}`}
//                         onClick={() => setActiveTab("agingLiabilities")}
//                     >
//                         Aging’s for Pending Liabilities
//                     </Link>
//                 </div>
//                 {activeTab === "agingLiabilities" && (
//                     <div className="flex justify-between items-center">
//                         <span></span>
//                         <div className="text-right">
//                             <span className="text-gray-800 font-semibold">As On: </span>
//                             <span className="text-primary font-bold">{currentDate}</span>
//                         </div>
//                     </div>
//                 )}
//                 {activeTab === "executiveSummary" && (
//                     <button
//                         type="button"
//                         className="ti-btn bg-primary border  text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
//                         onClick={() => {
//                             setShowFilters(!showFilters);
//                         }}
//                     >
//                         <i className="ri-filter-3-fill inline-block"></i> Filters
//                     </button>
//                 )}
//             </div>
//
//
//             {showsynctime && (
//                 <div className="error-message text-primary p-2 rounded-lg text-right text-black ">
//                     <p>{showsynctime}</p>
//                 </div>
//             )}
//
//
//             {errorMessage && (
//                 <div className="error-message alert alert-primary  p-2 rounded-lg shadow-md text-center text-black mb-2">
//                     <p>{errorMessage}</p>
//                 </div>
//             )}
//
//             {showFilters && activeTab === "executiveSummary" && (
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="bg-white p-3 mt-2 rounded-lg shadow-md flex items-center space-x-4 dark:text-gray-200 dark:bg-bodybg mb-4">
//                         <FormInput
//                                     type="date"
//                                     name="date_from"
//                                     control={control}
//                                     errors={errors}
//                                     placeholder="From"
//                                     label={true}
//                                 />
//
//                                 <FormInput
//                                     type="date"
//                                     name="date_to"
//                                     control={control}
//                                     errors={errors}
//                                     placeholder="To"
//                                     label={true}
//                                 />
//                         <FilterButton />
//
//                     </div>
//                 </form>
//             )}
//
//             <div className="grid grid-cols-12 gap-6  ">
//                 <div className="xl:col-span-12 col-span-12 ">
//                     <div className="tab-content  dark:text-gray-200 dark:bg-bodybg ">
//                         {activeTab === "executiveSummary" && (
//                             <div className="tab-pane show active p-6 dark:text-gray-900 dark:bg-bodybg " id="generate-report"
//                                  aria-labelledby="generate-report" role="tabpanel">
//                                 <ExecutiveForm filters={filters} />
//                             </div>
//                         )}
//
//                         {activeTab === "agingLiabilities" && (
//                             <div className="tab-pane show active p-6 dark:text-gray-900 dark:bg-bodybg mb-4 " id="replenishment-history"
//                                  aria-labelledby="replenishment-history" role="tabpanel">
//
//                                 <AgingForm />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };
//
// export default ExecutiveTabs;
import React, { useState, useMemo, useCallback, useEffect } from "react";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
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

    // Date initialization
    useEffect(() => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        setCurrentDate(`${day}-${month}-${year}`);
    }, []);

    // Filter configuration
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

    // Data fetching
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
            <PageHeader currentpage="Salesforce Dashboard"/>


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
                            <div className="p-6">
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
                                    pendingOrdersLibData={executiveData}
                                    loadingOrdersLib={executiveLoading}
                                    pendingOrdersData={executiveData}
                                    loadingOrders={executiveLoading}
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
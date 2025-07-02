
import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import CustomerAssistForm from "@modules/CustomerAssist/components/CustomerAssistForm.jsx";
import CustomerAssistList from "@modules/CustomerAssist/views/CustomerAssistList.jsx";
import CustomerAssistCasesDatatable from "@modules/CustomerAssist/views/CustomerAssistCasesDatatable.jsx";
import CustomerAssistPendingCasesDatatable from "@modules/CustomerAssist/views/CustomerAssistPendingCasesDatatable.jsx";

const CustomerAssist = () => {
    const [activeTab, setActiveTab] = useState("form");

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };


    const tabs = [
        {
            id: "form",
            label: "Search Case",
            icon: <i className="bi bi-ui-checks-grid text-info"></i>,
            content: <CustomerAssistForm isActive={activeTab === 'form'} />,
        },
        {
            id: "resolved",
            label: "Resolved Cases",
            icon: <i className="bi bi-check2-circle text-success"></i>,
            content: <CustomerAssistList url={`/customer-assist/datatable/`} isActive={activeTab === 'resolved'} />,
        },
        {
            id: "pending",
            label: "Pending Cases",
            icon: <i className="bi bi-hourglass-split text-warning"></i>,
            content: <CustomerAssistPendingCasesDatatable isActive={activeTab === 'pending'} />,
        },
        {
            id: "all_cases",
            label: "All Cases",
            icon: <i className="bi bi-collection text-primary"></i>,
            content: <CustomerAssistCasesDatatable isActive={activeTab === 'all_cases'} />,
        },

    ];

    return (
        <>
        <PageHeader currentpage="Customer Assist" mainpage="Customer Assist"  activepage="We Care" />
            <IconTabs tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />
        </>
    );
};

export default CustomerAssist;

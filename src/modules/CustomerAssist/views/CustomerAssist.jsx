
import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import CustomerAssistForm from "@modules/CustomerAssist/components/CustomerAssistForm.jsx";
import CustomerAssistList from "@modules/CustomerAssist/views/CustomerAssistList.jsx";
import CustomerAssistCasesDatatable from "@modules/CustomerAssist/views/CustomerAssistCasesDatatable.jsx";
import InfoAlert from "../../../InfoAlert.jsx";

const CustomerAssist = () => {
    const [activeTab, setActiveTab] = useState("form");

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };


    const tabs = [
        {
            id: "form",
            label: "Search",
            icon: <i className="bi bi-ui-checks-grid"></i>,
            content: <CustomerAssistForm isActive={activeTab === 'form'}/>,
        },
        {
            id: "list",
            label: "List",
            icon: <i className="bi bi-card-list"></i>,
            content: <CustomerAssistList url={`/customer-assist/datatable/`} isActive={activeTab === 'list'}/>,
        },
        {
            id: "all_cases",
            label: "All Cases",
            icon: <i className="bi bi-collection"></i>,
            content: <CustomerAssistCasesDatatable isActive={activeTab === 'all_cases'}/>,
        },

    ];

    return (
        <>
        <PageHeader currentpage="Customer Assist" mainpage="Customer Assist"  activepage="We Care" />
            <InfoAlert/>
            <IconTabs tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />
        </>
    );
};

export default CustomerAssist;

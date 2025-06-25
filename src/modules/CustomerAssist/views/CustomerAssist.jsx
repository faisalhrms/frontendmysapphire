
import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import CustomerAssistForm from "@modules/CustomerAssist/components/CustomerAssistForm.jsx";
import CustomerAssistList from "@modules/CustomerAssist/views/CustomerAssistList.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

const CustomerAssist = () => {
    const [activeTab, setActiveTab] = useState("form");



    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };


    const tabs = [
        {
            id: "form",
            label: "Search",
            icon: <i className="bi bi-search"></i>,
            content: <CustomerAssistForm isActive={activeTab === 'form'}/>,
        },
        {
            id: "list",
            label: "List",
            icon: <i className="bi bi-list-ul"></i>,
            content: <CustomerAssistList  url={`/customer-assist/datatable/`} isActive={activeTab === 'list'} />,
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

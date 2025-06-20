
import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import CustomerAssistForm from "@modules/CustomerAssist/components/CustomerAssistForm.jsx";
import CustomerAssistList from "@modules/CustomerAssist/views/CustomerAssistList.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

const CustomerAssist = () => {
    const [activeTab, setActiveTab] = useState("list");


    const listApiUrl = activeTab === "list" ? "/customer-assist/datatable/" : null;

    const { data, isLoading, refetch } = useFetchWithFilters(listApiUrl);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const listProps = {};
    if (activeTab === "list") {
        listProps.data = data;
        listProps.isLoading = isLoading;
        listProps.url = listApiUrl;
        listProps.refetch = refetch; // if your list component can use refetch
    }
    listProps.isActive = activeTab === "list";

    const tabs = [
        {
            id: "list",
            label: "List",
            icon: <i className="bi bi-list-ul"></i>,
            content: <CustomerAssistList {...listProps} />,
        },
        {
            id: "form",
            label: "Search/Create",
            icon: <i className="bi bi-search"></i>,
            content: <CustomerAssistForm />,
        },



    ];

    return (
        <>
            <PageHeader currentpage="We Care" mainpage="Support" />
            <IconTabs tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />
        </>
    );
};

export default CustomerAssist;

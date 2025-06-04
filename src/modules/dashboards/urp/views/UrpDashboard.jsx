import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import UrpCards from "@modules/dashboards/urp/components/UrpCards.jsx";
import {useUrpCard} from "@modules/dashboards/urp/hooks/UrpHook.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import UrpTables from "@modules/dashboards/urp/components/UrpTables.jsx";

const UrpDashboard = () => {
    const {cardData,loading}=useUrpCard();
    if (loading) {
        return <LoadingSpinner/>;
    }
    return (
        <>
            <PageHeader
                currentpage="User Roles & Permission Dashboard"
                activepage="Dashboards"
                mainpage="Roles & Permission"
            />
            <UrpCards cardData={cardData}/>
            <UrpTables/>
        </>
    )
}
export default UrpDashboard
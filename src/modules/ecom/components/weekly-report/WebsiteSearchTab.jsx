import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";

const WebsiteSearchTab = ({data, isLoading, isActive}) => {
    if (!isActive) {
        return null
    }
    if (isLoading) {
        return <LoadingSpinner/>;
    }
    return (
        <>

        </>
    )
}
export default WebsiteSearchTab
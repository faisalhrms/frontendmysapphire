import React from "react";
import useSalesForceSyncTime from "@modules/ecom/hooks/useSalesforceSyncTime.js";

const ReportSyncTime = ({endpoint = '/reporting/sf/fetch-sync-time/', syncType = 'order_summary'}, type = 'get') => {
   const {syncTime, errorMessage} = useSalesForceSyncTime(endpoint, syncType, type)
    return (
        <>
            {syncTime && (
                <div className="error-message text-primary p-2 rounded-lg text-right text-black">
                    <p>{syncTime}</p>
                </div>
            )}
            {errorMessage && (
                <div className="error-message alert alert-danger p-2 rounded-lg shadow-md text-center text-danger mb-2">
                    <p>{errorMessage}</p>
                </div>
            )}
        </>
    )
}

export default React.memo(ReportSyncTime);
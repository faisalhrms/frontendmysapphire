import React from "react";
import CountUp from "react-countup";
import InventorySvgIcon from "@components/InventorySvgIcon.jsx";

const AnalysisErrorForm = ({ errorData = { filters} }) => {
    if (!errorData || typeof errorData !== "object") {
        return <div className="box">No data available</div>;
    }
    const totalErrors = errorData?.error_404_count?.total_error || 0;
    const errorBreakdown = errorData?.error_404_date || [];

    return (
        <div className="box transition-transform transform hover:scale-105">
            <div className="box-body">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-red-500">404 Errors</p>
                        <p className="font-bold text-3xl">
                            <CountUp end={totalErrors} />
                        </p>
                    </div>
                    <div>
                        <InventorySvgIcon styles={{ color: "success" }} />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AnalysisErrorForm;

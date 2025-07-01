import React, { useState } from "react";
import { getCustomerCase } from "@modules/CustomerAssist/services/customerAssistService.js";
import CustomerAssistTabs from "@modules/CustomerAssist/components/CustomerAssistTabs.jsx";

const CustomerAssistForm = ({ isActive }) => {
    if (!isActive) return null;
    const [searchValue, setSearchValue] = useState("");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchValue.trim()) return;
        setIsLoading(true);
        setError(null);
        setData(null);
        try {
            const result = await getCustomerCase(searchValue);
            setData(result);
        } catch (err) {
            console.error("Search failed:", err);
            setError(err.message || "Failed to fetch case data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 custom-form-group">
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="form-control !py-4 !px-6 w-full !rounded-md form-control-lg shadow-sm"
                    placeholder="Case id, number, email, phone or Customer name.."
                    aria-label="Search input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <div className="custom-form-btn">
                    <button
                        className="ti-btn bg-primary text-white !font-medium !border dark:border-defaultborder/10-0"
                        type="button"
                        onClick={handleSearch}>
                        <i className="bi bi-search me-2"></i> Search
                    </button>
                </div>
            </div>
            <CustomerAssistTabs error={error} isLoading={isLoading} data={data} />
        </div>
    );
};

export default CustomerAssistForm;

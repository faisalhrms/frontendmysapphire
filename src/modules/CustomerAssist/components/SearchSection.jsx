import React, { useState } from "react";

const SearchSection = ({ onSearch }) => {
    const [search, setSearch] = useState("");

    return (
        <div className="mb-4 custom-form-group ">
            <input type="text"
                   className="form-control !py-4 !px-6 w-full  !rounded-md form-control-lg shadow-sm"
                   placeholder="Job title, Keywords or Company.."
                   aria-label="Recipient's username"/>
            <div className="custom-form-btn">
                <button className="ti-btn bg-primary text-white   !font-medium !border dark:border-defaultborder/10-0" type="button">
                    <i className="bi bi-search me-2"></i> Search
                </button>
            </div>
        </div>
    );
};

export default SearchSection;

import React from "react";

const FilterClearButton = ({ isLoading = false, onClick }) => {
    return (
        <button
            type="button"
            className="ti-btn ti-btn-secondary !mb-0"
            disabled={isLoading}
            onClick={onClick}
        >
            <i className="ri-refresh-line inline-block"></i>
        </button>
    );
};

export default React.memo(FilterClearButton);

import React from "react";

const FilterButton = ({ isLoading = false }) => {
    return (
        <button
            type="submit"
            className='ti-btn ti-btn-primary !mb-0'
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <span className="loading">
                        <i className="ri-loader-2-fill text-[1rem] animate-spin"></i>
                    </span>
                </>
            ) : (
                <i className="ri-filter-3-fill inline-block"></i>
            )}
        </button>
    );
};

export default React.memo(FilterButton);

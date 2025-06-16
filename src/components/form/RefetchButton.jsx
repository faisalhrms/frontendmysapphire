import React from "react";

const RefetchButton = ({ isLoading = false, refetch }) => {
    return (
        <button
            type="button"
            onClick={refetch}
            className='ti-btn ti-btn-info !mb-0'
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <span className="loading">
                        <i className="ri-loader-2-fill text-[1rem] animate-spin"></i>
                    </span>
                </>
            ) : (
                <>
                    <i className="ri-refresh-line inline-block"></i> Refetch
                </>
            )}
        </button>
    );
};

export default React.memo(RefetchButton);

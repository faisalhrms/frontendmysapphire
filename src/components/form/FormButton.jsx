const FormButton = ({ isLoading, text = "Save changes", className = "m-2", ...props }) => {
    return (
        <button
            type="submit"
            className={`ti-btn ti-btn-primary-full ti-btn-loader ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="me-2">Submitting...</span>
                    <span className="loading">
                        <i className="ri-loader-2-fill text-[1rem] animate-spin"></i>
                    </span>
                </>
            ) : (
                text
            )}
        </button>
    );
};

export default FormButton;

import React from "react";
import PropTypes from "prop-types";
import RequisitionInterviewCompleteModal from "../RequisitionInterviewCompleteModal.jsx";

const RequisitionInterviewCompleteWrapper = ({
                                                 requisitionId,
                                                 applicationId,
                                                 interviewData,
                                                 isOpen,
                                                 onClose,
                                                 onSuccess,
                                             }) => {
    if (!isOpen) return null;

    return (
        <RequisitionInterviewCompleteModal
            requisitionId={requisitionId}
            applicationId={applicationId}
            interviewData={interviewData}
            isOpen={isOpen}
            onClose={onClose}
            onSuccess={onSuccess}
        />
    );
};

RequisitionInterviewCompleteWrapper.propTypes = {
    requisitionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    applicationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    interviewData: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

export default RequisitionInterviewCompleteWrapper;

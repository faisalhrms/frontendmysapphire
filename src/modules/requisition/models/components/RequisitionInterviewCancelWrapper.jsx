import React from "react";
import PropTypes from "prop-types";
import RequisitionInterviewCancelModal from "../RequisitionInterviewCancelModal.jsx";

const RequisitionInterviewCancelWrapper = ({
                                               requisitionId,
                                               applicationId,
                                               interviewData,
                                               isOpen,
                                               onClose,
                                               onSuccess,
                                           }) => {
    if (!isOpen) return null;

    return (
        <RequisitionInterviewCancelModal
            requisitionId={requisitionId}
            applicationId={applicationId}
            interviewData={interviewData}
            isOpen={isOpen}
            onClose={onClose}
            onSuccess={onSuccess}
        />
    );
};

RequisitionInterviewCancelWrapper.propTypes = {
    requisitionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    applicationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    interviewData: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

export default RequisitionInterviewCancelWrapper;

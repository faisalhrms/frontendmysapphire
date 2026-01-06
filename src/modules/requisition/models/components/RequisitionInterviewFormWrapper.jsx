// @modules/requisition/components/interviews/RequisitionInterviewFormWrapper.jsx
import React from "react";
import PropTypes from "prop-types";
import RequisitionInterviewFormModal from "../RequisitionInterviewFormModal.jsx";

export default function RequisitionInterviewFormWrapper({
                                                            requisitionId,
                                                            applicationId,
                                                            interviewData,
                                                            isOpen,
                                                            onClose,
                                                            onSuccess,
                                                        }) {
    if (!isOpen) return null;

    return (
        <RequisitionInterviewFormModal
            isOpen={isOpen}
            onClose={onClose}
            requisitionId={requisitionId}
            applicationId={applicationId}
            interviewData={interviewData || null}   // ✅ pass through
            onSuccess={onSuccess}
        />
    );
}

RequisitionInterviewFormWrapper.propTypes = {
    requisitionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    applicationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    interviewData: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};
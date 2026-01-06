// @modules/requisition/services/requisitionInterviewService.js
import api from "../../../config/axiosConfig.js";

/**
 * POST
 * /api/requisitions/:requisitionId/applicants/:applicationId/interviews/
 */
export const createApplicantInterview = async (requisitionId, applicationId, payload) => {
    const { data } = await api.post(
        `/requisitions/${requisitionId}/applicants/${applicationId}/interviews/`,
        payload
    );

    // adapt if your API wrapper uses {data:{...}}
    return data?.data ?? data;
};

export const updateApplicantInterview = async (requisitionId, applicationId, interviewId, payload) => {
    const { data } = await api.patch(
        `/requisitions/${requisitionId}/applicants/${applicationId}/interviews/${interviewId}/`,
        payload
    );
    return data?.data ?? data;
};

export const requisitionInterviewActionsService = {
    complete: async (requisitionId, applicationId, interviewId, payload) => {
        const res = await api.post(
            `/requisitions/${requisitionId}/applicants/${applicationId}/interviews/${interviewId}/complete/`,
            payload
        );
        return res?.data;
    },

    cancel: async (requisitionId, applicationId, interviewId, payload) => {
        const res = await api.post(
            `/requisitions/${requisitionId}/applicants/${applicationId}/interviews/${interviewId}/cancel/`,
            payload
        );
        return res?.data;
    },
};
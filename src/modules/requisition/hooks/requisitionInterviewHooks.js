// @modules/requisition/hooks/requisitionInterviewHooks.js
import { useCallback } from "react";
import { createApplicantInterview, updateApplicantInterview } from "@modules/requisition/services/requisitionInterviewService.js";
import {requisitionInterviewActionsService} from "../services/requisitionInterviewService.js";

export const useRequisitionInterviewForm = (requisitionId, applicationId) => {
    const createInterview = useCallback(
        async (payload) => {
            if (!requisitionId) throw new Error("Missing requisitionId");
            if (!applicationId) throw new Error("Missing applicationId");
            return await createApplicantInterview(requisitionId, applicationId, payload);
        },
        [requisitionId, applicationId]
    );

    const updateInterview = useCallback(
        async (interviewId, payload) => {
            if (!requisitionId) throw new Error("Missing requisitionId");
            if (!applicationId) throw new Error("Missing applicationId");
            if (!interviewId) throw new Error("Missing interviewId");
            return await updateApplicantInterview(requisitionId, applicationId, interviewId, payload);
        },
        [requisitionId, applicationId]
    );

    return { createInterview, updateInterview };
};


export const useRequisitionInterviewActions = (requisitionId, applicationId) => {
    const completeInterview = (interviewId, payload) =>
        requisitionInterviewActionsService.complete(requisitionId, applicationId, interviewId, payload);

    const cancelInterview = (interviewId, payload) =>
        requisitionInterviewActionsService.cancel(requisitionId, applicationId, interviewId, payload);

    return { completeInterview, cancelInterview };
};
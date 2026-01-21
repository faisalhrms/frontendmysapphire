// src/modules/requisition/routes.js
import JobDescList from "@modules/requisition/views/JobDescList.jsx";
import JobDescDetail from "@modules/requisition/views/JobDescDetail.jsx";
import RequisitionList from "@modules/requisition/views/RequisitionList.jsx";
import RequisitionAdd from "./views/RequisitionAdd.jsx";
import RequisitionEdit from "./views/RequisitionEdit.jsx";
import RequisitionDetail from "./views/RequisitionDetail.jsx";
import RequisitionApplicantDetail from "./views/RequisitionApplicantDetail.jsx";

import RequisitionApplicant from "./views/RequisitionApplicant.jsx";
import ApplicantInterviewHistory from "./components/ApplicantInterviewHistory.jsx";
import RequisitionMyPendingFeedbackList from "./views/RequisitionMyPendingFeedbackList.jsx";
import RequisitionApplicantBank from "./views/RequisitionApplicantBank.jsx";
import RequisitionCandidateProfile from "./views/RequisitionCandidateProfile.jsx";
import RequisitionDashboard from "@modules/requisition/views/RequisitionDashboard.jsx";
import RequisitionDecisionSummary from "@modules/requisition/views/RequisitionDecisionSummary.jsx";
import RequisitionOfferApprovalInboxList from "@modules/requisition/views/RequisitionOfferApprovalInboxList.jsx";

export const REQUISITION_ROUTES = {
    JOB_DESCRIPTION: {
        READ: {
            path: "/module/requisition/job-description/list",
            permission: "requisition.view_jobdescription",
        },
        DETAIL: {
            path: "/module/requisition/job-description/detail/:id",
            permission: "requisition.view_jobdescription",
        },
    },

    REQUISITION: {
        READ: {
            path: "/module/requisition/list",
            permission: "requisition.view_requisition",
        },
        ADD: {
            path: "/module/requisition/add",
            permission: "requisition.add_requisition",
        },
        EDIT: {
            path: "/module/requisition/edit/:id",
            permission: "requisition.change_requisition",
        },
        DETAIL: {
            path: "/module/requisition/detail/:id",
            permission: "requisition.view_requisition",
        },

        // Applicants
        SUBMISSIONS: {
            path: "/module/requisition/applicants/:requisitionId",
            permission: "requisition.view_employmentapplication",
        },
        APPLICANTS_TABS: {
            path: "/module/requisition/:requisitionId/applicants",
            permission: "requisition.view_employmentapplication",
        },
        APPLICANT_DETAIL: {
            path: "/module/requisition/:requisitionId/applicants/:applicationId",
            permission: "requisition.view_employmentapplication",
        },
        APPLICANT_INTERVIEW_HISTORY: {
            path: "/module/requisition/:requisitionId/applicants/:applicationId/interviews",
            permission: "requisition.view_employmentapplicationinterview",
        },

        // Interviewer pending feedback
        MY_PENDING_FEEDBACK: {
            path: "/module/requisition/my-pending-feedback",
            permission: "requisition.view_employmentapplicationinterview",
        },
        APPLICANT_BANK:{
            path: "/module/requisition/applicant-bank",
            permission: "requisition.view_employmentapplicationinterview",
        },
        CANDIDATE_PROFILE:{
            path: "/module/requisition/candidates/:applicationId",
            permission: "requisition.view_employmentapplicationinterview",

        },
        REQUISITION_DASHBOARD: {
            path: "/module/requisition/:id/dashboard",
            permission: "requisition.view_employmentapplicationinterview",
        },
        REQUISITION_DECISION_SUMMARY:{
            path: "/module/requisition/:requisitionId/applicants/:applicationId/decision-summary",
            permission: "requisition.view_employmentapplicationinterview",
        },
        OFFER_APPROVAL_INBOX: {
            path: "/module/requisition/offer-approval-inbox",
            permission: "requisition.view_employmentapplicationinterview",
        },
    },


};

export const MODULE_ROUTES = [
    {
        path: REQUISITION_ROUTES.JOB_DESCRIPTION.READ.path,
        component: JobDescList,
        permission: REQUISITION_ROUTES.JOB_DESCRIPTION.READ.permission,
    },
    {
        path: REQUISITION_ROUTES.JOB_DESCRIPTION.DETAIL.path,
        component: JobDescDetail,
        permission: REQUISITION_ROUTES.JOB_DESCRIPTION.DETAIL.permission,
    },

    {
        path: REQUISITION_ROUTES.REQUISITION.READ.path,
        component: RequisitionList,
        permission: REQUISITION_ROUTES.REQUISITION.READ.permission,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.ADD.path,
        component: RequisitionAdd,
        permission: REQUISITION_ROUTES.REQUISITION.ADD.permission,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.EDIT.path,
        component: RequisitionEdit,
        permission: REQUISITION_ROUTES.REQUISITION.EDIT.permission,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.DETAIL.path,
        component: RequisitionDetail,
        permission: REQUISITION_ROUTES.REQUISITION.DETAIL.permission,
    },

    {
        path: REQUISITION_ROUTES.REQUISITION.APPLICANTS_TABS.path,
        component: RequisitionApplicant,
        permission: REQUISITION_ROUTES.REQUISITION.APPLICANTS_TABS.permission,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.APPLICANT_DETAIL.path,
        component: RequisitionApplicantDetail,
        permission: REQUISITION_ROUTES.REQUISITION.APPLICANT_DETAIL.permission,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.APPLICANT_INTERVIEW_HISTORY.path,
        component: ApplicantInterviewHistory,
        permission: REQUISITION_ROUTES.REQUISITION.APPLICANT_INTERVIEW_HISTORY.permission,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.MY_PENDING_FEEDBACK.path,
        component: RequisitionMyPendingFeedbackList,
        permission: REQUISITION_ROUTES.REQUISITION.MY_PENDING_FEEDBACK.permission,
    },
    {
        path:REQUISITION_ROUTES.REQUISITION.APPLICANT_BANK.path,
        component:RequisitionApplicantBank,
        permission: REQUISITION_ROUTES.REQUISITION.APPLICANT_BANK.permission
    },
    {
        path:REQUISITION_ROUTES.REQUISITION.CANDIDATE_PROFILE.path,
        component: RequisitionCandidateProfile,
        permission: REQUISITION_ROUTES.REQUISITION.CANDIDATE_PROFILE.permission
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.REQUISITION_DASHBOARD.path,
        component: RequisitionDashboard,
        permission: REQUISITION_ROUTES.REQUISITION.REQUISITION_DASHBOARD.permission
    },
    {
        path:REQUISITION_ROUTES.REQUISITION.REQUISITION_DECISION_SUMMARY.path,
        component: RequisitionDecisionSummary,
        permission: REQUISITION_ROUTES.REQUISITION.REQUISITION_DECISION_SUMMARY.permission
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.OFFER_APPROVAL_INBOX.path,
        component: RequisitionOfferApprovalInboxList,
        permission: REQUISITION_ROUTES.REQUISITION.OFFER_APPROVAL_INBOX.permission,
    },


];

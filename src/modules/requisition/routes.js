import JobDescList from "@modules/requisition/views/JobDescList.jsx";
import JobDescDetail from "@modules/requisition/views/JobDescDetail.jsx";
import RequisitionList from "@modules/requisition/views/RequisitionList.jsx";
import RequisitionAdd from "./views/RequisitionAdd.jsx";
import RequisitionEdit from "./views/RequisitionEdit.jsx";
import RequisitionDetail from "./views/RequisitionDetail.jsx";
import RequisitionApplicantDetail from "./views/RequisitionApplicantDetail.jsx";

// ✅ NEW (tabs page)
import RequisitionApplicant from "./views/RequisitionApplicant.jsx";
import ApplicantInterviewHistory from "./components/ApplicantInterviewHistory.jsx";

export const REQUISITION_ROUTES = {
    JOB_DESCRIPTION: {
        READ: {
            path: "/module/requisition/job-description/list",
        },

        DETAIL: {
            path: "/module/requisition/job-description/detail/:id",
        },
    },

    REQUISITION: {
        ADD: {
            path: "/module/requisition/add",
        },
        EDIT: {
            path: "/module/requisition/edit/:id",
        },
        DETAIL: {
            path: "/module/requisition/detail/:id",
        },
        READ: {
            path: "/module/requisition/list",
        },

        // ✅ EXISTING (keep it, if you still need old screen)
        SUBMISSIONS: {
            path: "/module/requisition/applicants/:requisitionId",
        },

        // ✅ NEW (tabs page route)
        APPLICANTS_TABS: {
            path: "/module/requisition/:requisitionId/applicants",
        },

        APPLICANT_DETAIL: {
            path: "/module/requisition/:requisitionId/applicants/:applicationId",
        },
        APPLICANT_INTERVIEW_HISTORY:{
            path: "/module/requisition/:requisitionId/applicants/:applicationId/interviews",

        }
    },
};

export const MODULE_ROUTES = [
    {
        path: REQUISITION_ROUTES.JOB_DESCRIPTION.READ.path,
        component: JobDescList,
    },
    {
        path: REQUISITION_ROUTES.JOB_DESCRIPTION.DETAIL.path,
        component: JobDescDetail,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.READ.path,
        component: RequisitionList,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.ADD.path,
        component: RequisitionAdd,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.EDIT.path,
        component: RequisitionEdit,
    },
    {
        path: REQUISITION_ROUTES.REQUISITION.DETAIL.path,
        component: RequisitionDetail,
    },

    // ✅ NEW (tabs page)
    {
        path: REQUISITION_ROUTES.REQUISITION.APPLICANTS_TABS.path,
        component: RequisitionApplicant,
    },
    //
    // // ✅ EXISTING (old applicants list - keep if still used)
    // {
    //     path: REQUISITION_ROUTES.REQUISITION.SUBMISSIONS.path,
    //     component: RequisitionApplicantsList,
    // },

    {
        path: REQUISITION_ROUTES.REQUISITION.APPLICANT_DETAIL.path,
        component: RequisitionApplicantDetail,
    },
    {
        path:REQUISITION_ROUTES.REQUISITION.APPLICANT_INTERVIEW_HISTORY.path,
        component: ApplicantInterviewHistory
    }
];

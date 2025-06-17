import ApplicantsList from "@modules/recruitment/views/ApplicantsList.jsx";
import ApplicantAdd from "@modules/recruitment/views/ApplicantAdd.jsx";
import ApplicantEdit from "@modules/recruitment/views/ApplicantEdit.jsx";
import ApplicantDetail from "@modules/recruitment/views/ApplicantDetail.jsx";
import ApplicantLists from "@modules/recruitment/views/ApplicantLists.jsx";
import {DAILYREPORT_ROUTES} from "@modules/DailyReport/routes.js";

export const RECRUITMENTS_ROUTES = {
    READ:{
        path:'/recruitment/all-applicants',
        permission: "recruitment.view_applicant",
    },
    ADD:{
        path:'/recruitment/applicants/add',
        permission: "recruitment.add_applicant",

    },
    DETAIL:{
        path:'/recruitment/applicants/detail/:id',
        permission: "recruitment.view_applicant",

    },
    EDIT:{
        path:'/recruitment/applicants/edit/:id',
        permission: "recruitment.change_applicant",

    }

}
export const MODULE_ROUTES = [
    {
        path: RECRUITMENTS_ROUTES.READ.path,
        component:ApplicantLists,
        permission: RECRUITMENTS_ROUTES.READ.permission,
    },
    {
        path:RECRUITMENTS_ROUTES.ADD.path,
        component:ApplicantAdd,
        permission: RECRUITMENTS_ROUTES.ADD.permission,

    },
    {
        path:RECRUITMENTS_ROUTES.EDIT.path,
        component:ApplicantEdit,
        permission: RECRUITMENTS_ROUTES.EDIT.permission,
    },
    {
        path:RECRUITMENTS_ROUTES.DETAIL.path,
        component:ApplicantDetail,
        permission: RECRUITMENTS_ROUTES.DETAIL.permission,
    }
]
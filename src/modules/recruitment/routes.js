import ApplicantsList from "@modules/recruitment/views/ApplicantsList.jsx";
import ApplicantAdd from "@modules/recruitment/views/ApplicantAdd.jsx";
import ApplicantEdit from "@modules/recruitment/views/ApplicantEdit.jsx";
import ApplicantDetail from "@modules/recruitment/views/ApplicantDetail.jsx";
import ApplicantLists from "@modules/recruitment/views/ApplicantLists.jsx";

export const RECRUITMENTS_ROUTES = {
    READ:{
        path:'/recruitment/all-applicants',
    },
    ADD:{
        path:'/recruitment/applicants/add',
    },
    DETAIL:{
        path:'/recruitment/applicants/detail/:id',
    },
    EDIT:{
        path:'/recruitment/applicants/edit/:id',
    }

}
export const MODULE_ROUTES = [
    {
        path: RECRUITMENTS_ROUTES.READ.path,
        component:ApplicantLists
    },
    {
        path:RECRUITMENTS_ROUTES.ADD.path,
        component:ApplicantAdd
    },
    {
        path:RECRUITMENTS_ROUTES.EDIT.path,
        component:ApplicantEdit
    },
    {
        path:RECRUITMENTS_ROUTES.DETAIL.path,
        component:ApplicantDetail
    }
]
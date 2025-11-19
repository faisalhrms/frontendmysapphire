import JobDescList from "@modules/requisition/views/JobDescList.jsx";
import JobDescDetail from "@modules/requisition/views/JobDescDetail.jsx";
import RequisitionList from "@modules/requisition/views/RequisitionList.jsx";
import RequisitionAdd from "./views/RequisitionAdd.jsx";
import RequisitionEdit from "./views/RequisitionEdit.jsx";

export const REQUISITION_ROUTES = {
    JOB_DESCRIPTION: {
        READ: {
            path: '/module/requisition/job-description/list',

        },

        DETAIL: {
            path: '/module/requisition/job-description/detail/:id',
        },

    },
    REQUISITION:{
        ADD: {
            path: '/module/requisition/add',
        },
        EDIT: {
            path: '/module/requisition/edit/:id',
        },
        DETAIL: {
            path: '/module/requisition/detail/:id',
        },
        READ: {
            path: '/module/requisition/list',
        },

    }

};

export const MODULE_ROUTES = [
    {
        path: REQUISITION_ROUTES.JOB_DESCRIPTION.READ.path,
        component: JobDescList,

    },
    {
        path: REQUISITION_ROUTES.JOB_DESCRIPTION.DETAIL.path,
        component:JobDescDetail,
    },
    {
        path:REQUISITION_ROUTES.REQUISITION.READ.path,
        component:RequisitionList
    },
    {
        path:REQUISITION_ROUTES.REQUISITION.ADD.path,
        component:RequisitionAdd
    },
    {
        path:REQUISITION_ROUTES.REQUISITION.EDIT.path,
        component: RequisitionEdit
    }

];

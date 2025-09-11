import TaskApprovalList from '@modules/approvals/task/views/TaskApprovalList.jsx';
import ObjectiveApprovalList from "@modules/approvals/objective/views/ObjectiveApprovalList.jsx";
import DynamicFormApprovalList from "@modules/approvals/dynamiceform/view/DynamicFormApprovalList.jsx";
import ApprovalTypeSetupDatatable from "@modules/approvals/setup/views/ApprovalTypeSetupDatatable.jsx";
import CreateApprovalTypeSetup from "@modules/approvals/setup/views/CreateApprovalTypeSetup.jsx";
import EditApprovalTypeSetup from "@modules/approvals/setup/views/EditApprovalTypeSetup.jsx";

const SETUP_PERMISSION = 'approvals.dynamic_hierarchy_management'

export const APPROVAL_ROUTES = {
    TASK: {
        path: '/module/approvals/task',
        permission: 'pms.manage_task_approvals',
    },
    OBJECTIVE:{
        path:'/module/approvals/objective',
        permission: 'user.view_ess_modules',
    },
    FORM:{
        path:'/module/approvals/form',
        permission: 'user.view_ess_modules',
    },
    SETUP: {
        TYPE:{
            READ: {
                path: '/module/approvals/setups/type',
                permission:SETUP_PERMISSION
            },
            ADD:{
                path:'/module/approvals/setups/type/create',
                permission:SETUP_PERMISSION
            },
            EDIT:{
                path:'/module/approvals/setups/type/edit/:id',
                permission:SETUP_PERMISSION
            }
        }
    }
};

export const MODULE_ROUTES = [
    {
        path: APPROVAL_ROUTES.TASK.path,
        component: TaskApprovalList,
        permission: APPROVAL_ROUTES.TASK.permission,
    },
    {
        path: APPROVAL_ROUTES.OBJECTIVE.path,
        component:ObjectiveApprovalList,
        permission: APPROVAL_ROUTES.OBJECTIVE.permission,
    },
    {
        path: APPROVAL_ROUTES.FORM.path,
        component:DynamicFormApprovalList,
        permission: APPROVAL_ROUTES.FORM.permission,
    },
    {
        path: APPROVAL_ROUTES.SETUP.TYPE.READ.path,
        component:ApprovalTypeSetupDatatable,
        permission: SETUP_PERMISSION,
    },
    {
        path: APPROVAL_ROUTES.SETUP.TYPE.ADD.path,
        component:CreateApprovalTypeSetup,
        permission: SETUP_PERMISSION,
    },
    {
        path: APPROVAL_ROUTES.SETUP.TYPE.EDIT.path,
        component:EditApprovalTypeSetup,
        permission: SETUP_PERMISSION,
    },
];

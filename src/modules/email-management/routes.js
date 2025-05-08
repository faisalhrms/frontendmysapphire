import Sr from "@modules/sr-management/views/Sr.jsx";
import EmailManagementList from "@modules/email-management/views/EmailManagementList.jsx";
import ApprovalManagementList from "@modules/email-management/views/ApprovalManagementList.jsx";

export const EMAIL_MANAGEMENT_ROUTE = {
    READ:{
        path:'/user-management/list',
         permission:'user.view_ess_modules',
    },
    READ_ALL:{
        path:'/user-management/all-approvals',
        permission:'user.view_ess_modules',
    }
};

export const MODULE_ROUTES = [
    {
        path: EMAIL_MANAGEMENT_ROUTE.READ.path,
        component: EmailManagementList,
         permission: EMAIL_MANAGEMENT_ROUTE.READ.permission

    },
    {
        path:EMAIL_MANAGEMENT_ROUTE.READ_ALL.path,
        component: ApprovalManagementList,
        permission: EMAIL_MANAGEMENT_ROUTE.READ_ALL.permission
    }
    ]
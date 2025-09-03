import EditDynamicForm from "@modules/forms/views/EditDynamicForm.jsx";
import DatatableDynamicForm from "@modules/forms/views/DatatableDynamicForm.jsx";
import CreateDynamicForm from "@modules/forms/views/CreateDynamicForm.jsx";
import FormSubmissionDatatable from "@modules/forms/views/FormSubmissionDatatable.jsx";
import DynamicFormsApprovalSetup from "@modules/forms/views/DynamicFormApprovalSetup.jsx";
import DynamicFormDetail from "@modules/forms/views/DynamicFormDetail.jsx";

export const FORMS_ROUTES = {
    LIST: {
        path: '/module/forms',
        permission: 'forms.view_form',
    },
    CREATE: {
        path: '/module/forms/create',
        permission: 'forms.add_form',
    },
    EDIT: {
        path: "/module/forms/edit/:id",
        permission: 'forms.change_form',
    },
    SUBMISSIONS: {
        path: "/module/forms/submissions/:id",
        permission: 'forms.view_form',
    },
    SETUPS: {
        APPROVAL: {
            path: "/module/forms/setups/approval-hierarchy",
            permission: 'forms.manage_approval_hierarchy',
        },
    },
    DETAIL: {
        path: "/module/forms/detail/:id",
        permission: 'user.view_ess_modules',
    },
};

export const MODULE_ROUTES = [
    {
        path: FORMS_ROUTES.LIST.path,
        component: DatatableDynamicForm,
        permission: FORMS_ROUTES.LIST.permission,
    },
    {
        path: FORMS_ROUTES.CREATE.path,
        component: CreateDynamicForm,
        permission: FORMS_ROUTES.LIST.permission,
    },
    {
        path: FORMS_ROUTES.EDIT.path,
        component: EditDynamicForm,
        permission: FORMS_ROUTES.LIST.permission,
    },
    {
        path: FORMS_ROUTES.SUBMISSIONS.path,
        component: FormSubmissionDatatable,
        permission: FORMS_ROUTES.SUBMISSIONS.permission,
    },
    {
        path: FORMS_ROUTES.SETUPS.APPROVAL.path,
        component: DynamicFormsApprovalSetup,
        permission: FORMS_ROUTES.SETUPS.APPROVAL.permission,
    },
    {
        path: FORMS_ROUTES.DETAIL.path,
        component: DynamicFormDetail,
        permission: FORMS_ROUTES.DETAIL.permission,
    },
];

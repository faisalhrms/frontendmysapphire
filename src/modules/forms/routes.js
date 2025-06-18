import EditDynamicForm from "@modules/forms/views/EditDynamicForm.jsx";
import DatatableDynamicForm from "@modules/forms/views/DatatableDynamicForm.jsx";
import CreateDynamicForm from "@modules/forms/views/CreateDynamicForm.jsx";

export const FORMS_ROUTES = {
    LIST: {
        path: '/module/forms',
    },
    CREATE: {
        path: '/module/forms/create',
    },
    EDIT: {
        path: "/module/forms/edit/:id",
    },
};

export const MODULE_ROUTES = [
    {
        path: FORMS_ROUTES.LIST.path,
        component: DatatableDynamicForm,
    },
    {
        path: FORMS_ROUTES.CREATE.path,
        component: CreateDynamicForm,
    },
    {
        path: FORMS_ROUTES.EDIT.path,
        component: EditDynamicForm,
    },
];

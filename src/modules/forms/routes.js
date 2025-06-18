import CreateDynamicForm from '@modules/forms/views/CreateDynamicForm.jsx';

export const FORMS_ROUTES = {
    CREATE: {
        path: '/module/forms/create',
    },
};

export const MODULE_ROUTES = [
    {
        path: FORMS_ROUTES.CREATE.path,
        component: CreateDynamicForm,
    },
];

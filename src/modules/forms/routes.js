import CreateDynamicForm from '@modules/forms/views/CreateDynamicForm.jsx';
import CustomerFeedbackForm from "@modules/forms/components/CustomerFeebback.jsx";

export const FORMS_ROUTES = {
    CREATE: {
        path: '/module/forms/create',
    },
    EDIT:{
        path: "/module/forms/customer-feedback-form",

    },

};

export const MODULE_ROUTES = [
    {
        path: FORMS_ROUTES.CREATE.path,
        component: CreateDynamicForm,
    },
    {
        path: FORMS_ROUTES.EDIT.path,
        component: CustomerFeedbackForm,
    },
];

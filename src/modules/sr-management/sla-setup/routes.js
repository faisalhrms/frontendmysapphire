import SlaSetupList from "@modules/sr-management/sla-setup/views/SlaSetupList.jsx";
import SlaSetupForm from "@modules/sr-management/sla-setup/component/SlaSetupForm.jsx";
import SlaSetupEdit from "@modules/sr-management/sla-setup/views/SlaSetupEdit.jsx";


export const SLA_SETUP_ROUTES = {
    READ: {
        path: "/module/sla/setup",
        permission: "view_sr_sla",
    },
    CREATE: {
        path: '/module/sla/setup/add/',
    },
    EDIT: {
        path: '/module/sla/setup/edit',
    },
};

export const MODULE_ROUTES = [
    {
        path: SLA_SETUP_ROUTES.READ.path,
        component: SlaSetupList,
        permission: SLA_SETUP_ROUTES.READ.permission,
    },
    {
        path: SLA_SETUP_ROUTES.CREATE.path,
        component: SlaSetupForm,
    },
    {
        path: SLA_SETUP_ROUTES.EDIT.path,
        component: SlaSetupEdit,
    },
];

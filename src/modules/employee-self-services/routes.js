import ServiceRequestList from '@modules/employee-self-services/service-request/views/ServiceRequestList.jsx';
import ServiceRequestCreate from '@modules/employee-self-services/service-request/views/ServiceRequestCreate.jsx';
import ServiceRequestEdit from '@modules/employee-self-services/service-request/views/ServiceRequestEdit.jsx';
import ServiceRequestDetail from '@modules/employee-self-services/service-request/views/ServiceRequestDetail.jsx';
import WorkDesk from '@modules/employee-self-services/work-desk/views/WorkDesk.jsx';
import DiscountCard from '@modules/employee-self-services/discount-card/views/DiscountCard.jsx';
import DigitalProfile from '@modules/employee-self-services/my-digital-profile/views/DigitalProfile.jsx';
export const SELF_SERVICES_ROUTES = {
    SERVICES: {
        READ: {
            path: '/module/ess/services-request',
            permission: 'user.view_ess_modules',
        },
        CREATE: {
            path: '/module/ess/service-request/create',
        },
        EDIT: {
            path: '/module/ess/service-request/edit/:id',
        },
        DETAIL: {
            path: '/module/ess/service-request/detail/:id',
        },
        WORK_DESK: {
            path: '/module/ess/work-desk',
            permission: 'user.view_ess_modules',
        },
        DISCOUNT_CARD: {
            path: '/module/ess/discount-card',
            permission: 'user.view_ess_modules',
        },
        DIGITAL_PROFILE: {
            path: '/module/ess/my/digital/profile',
            permission: 'user.view_ess_modules',
        },

    }
};

export const MODULE_ROUTES = [
    {
        path: SELF_SERVICES_ROUTES.SERVICES.READ.path,
        component: ServiceRequestList,
        permission: SELF_SERVICES_ROUTES.SERVICES.READ.permission,
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.CREATE.path,
        component: ServiceRequestCreate,
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.EDIT.path,
        component: ServiceRequestEdit,
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.DETAIL.path,
        component: ServiceRequestDetail,
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.WORK_DESK.path,
        component: WorkDesk,
        permission: SELF_SERVICES_ROUTES.SERVICES.WORK_DESK.permission,
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.DISCOUNT_CARD.path,
        component: DiscountCard,
        permission:SELF_SERVICES_ROUTES.SERVICES.DISCOUNT_CARD.permission,
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.DIGITAL_PROFILE.path,
        component: DigitalProfile,
        permission:SELF_SERVICES_ROUTES.SERVICES.DIGITAL_PROFILE.permission,
    },
];

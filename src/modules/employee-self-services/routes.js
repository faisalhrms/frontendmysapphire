import ServiceRequestList from '@modules/employee-self-services/service-request/views/ServiceRequestList.jsx';
import ServiceRequestCreate from '@modules/employee-self-services/service-request/views/ServiceRequestCreate.jsx';
import ServiceRequestEdit from '@modules/employee-self-services/service-request/views/ServiceRequestEdit.jsx';
import ServiceRequestDetail from '@modules/employee-self-services/service-request/views/ServiceRequestDetail.jsx';
import WorkDesk from '@modules/employee-self-services/work-desk/views/WorkDesk.jsx';
import DiscountCard from '@modules/employee-self-services/discount-card/views/DiscountCard.jsx';
import DigitalProfile from '@modules/employee-self-services/my-digital-profile/views/DigitalProfile.jsx';
import TaskList from "@modules/employee-self-services/task-list/views/TaskList.jsx";
export const SELF_SERVICES_ROUTES = {
    SERVICES: {
        READ: {
            path: '/module/ess/services-request',
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
        },
        DISCOUNT_CARD: {
            path: '/module/ess/discount-card',
        },
        DIGITAL_PROFILE: {
            path: '/module/ess/my/digital/profile',
        },

    },
    TASK_LIST:{
        path:`/module/ess/my/tasks/`,
    }
};

export const MODULE_ROUTES = [
    {
        path: SELF_SERVICES_ROUTES.SERVICES.READ.path,
        component: ServiceRequestList,
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
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.DISCOUNT_CARD.path,
        component: DiscountCard,
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.DIGITAL_PROFILE.path,
        component: DigitalProfile,
    },
    {
        path:SELF_SERVICES_ROUTES.TASK_LIST.path,
        component:TaskList
    }
];

import ServiceRequestList from '@modules/employee-self-services/service-request/views/ServiceRequestList.jsx';
import ServiceRequestCreate from '@modules/employee-self-services/service-request/views/ServiceRequestCreate.jsx';
import ServiceRequestEdit from '@modules/employee-self-services/service-request/views/ServiceRequestEdit.jsx';
import ServiceRequestDetail from '@modules/employee-self-services/service-request/views/ServiceRequestDetail.jsx';
import WorkDesk from '@modules/employee-self-services/work-desk/views/WorkDesk.jsx';
import DiscountCard from '@modules/employee-self-services/discount-card/views/DiscountCard.jsx';
import DigitalProfile from '@modules/employee-self-services/my-digital-profile/views/DigitalProfile.jsx';
import SelfPolicies from "@modules/policies/views/SelfPolicies.jsx";
import ObjectivesList from "@modules/employee-self-services/objectives/views/ObjectivesList.jsx";
import CreateObjective from "@modules/employee-self-services/objectives/views/CreateObjective.jsx";
import EditObjective from "@modules/employee-self-services/objectives/views/EditObjective.jsx";
import ObjectiveDetail from "@modules/employee-self-services/objectives/views/ObjectiveDetail.jsx";
import TeamObjectivesList from "@modules/employee-self-services/objectives/views/TeamObjectivesList.jsx";
import BrandBook from "@modules/employee-self-services/brand-book/views/BrandBook.jsx";
import CourseOffering from "@modules/employee-self-services/course-learning/views/CourseOffering.jsx";
import CourseOfferingDetail from "@modules/employee-self-services/course-learning/components/CourseOfferingDetail.jsx";
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
        POLICIES:{
            path: '/module/ess/policies',
            permission:'user.view_ess_modules'
        },
        OBJECTIVES:{
            LIST: {
                path:'/module/ess/objectives',
                permission: "hrms.manage_year_setup_form"
            },
            CREATE: {
                path:'/module/ess/objectives/create',
            },
            EDIT: {
                path: "/module/ess/objectives/edit/:year",
            },
            DETAIL: {
                path: "/module/ess/objectives/detail/:slug",
            },
            TEAM: {
                path: "/module/ess/objectives/team",
                permission: "hrms.manage_year_setup_form"
            },
        }
        ,
        BRAND_BOOK:{
            path: "/module/ess/brand-book",
            permission:"user.view_ess_modules"

        },
        E_LEARNING: {
            path: "/module/ess/courses",
            permission:"lms.manage_course_offerings"
        },
        E_LEARNING_DETAIL: {
            path: "/module/ess/course/:slug",
            permission:"lms.manage_course_offerings"
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
    {
        path:SELF_SERVICES_ROUTES.SERVICES.POLICIES.path,
        component:SelfPolicies,
        permission: SELF_SERVICES_ROUTES.SERVICES.POLICIES.permission
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.LIST.path,
        component:ObjectivesList,
        permission: SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.LIST.permission
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.CREATE.path,
        component: CreateObjective
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.EDIT.path,
        component: EditObjective
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.DETAIL.path,
        component: ObjectiveDetail
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.TEAM.path,
        component: TeamObjectivesList,
        permission: SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.TEAM.permission
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.BRAND_BOOK.path,
        component:BrandBook,
        permission: SELF_SERVICES_ROUTES.SERVICES.BRAND_BOOK.permission
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.E_LEARNING.path,
        component: CourseOffering,
        permission: SELF_SERVICES_ROUTES.SERVICES.E_LEARNING.permission,
    },
    {
        path: SELF_SERVICES_ROUTES.SERVICES.E_LEARNING_DETAIL.path,
        component: CourseOfferingDetail,
        permission: SELF_SERVICES_ROUTES.SERVICES.E_LEARNING.permission,
    },
];

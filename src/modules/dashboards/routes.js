export const DASHBOARD_ROUTES = {
    PROJECT: {
        path: '/dashboards/project-management-system',
        permission: 'pms_dashboard',

    },
    BI:{
        path: '/dashboards/business-intelligence',
        permission: 'bi_dashboard',
    },
    CIO:{
        path: '/dashboards/chief-information-officer',
        permission: 'cio_dashboard',
    },
    CS:{
        path: '/dashboards/cyber-security',
        permission: 'cs_dashboard',
    },
    SUBSCRIPTION:{
        path: '/dashboards/subscription',
         permission:'sms_dashboard'
    },
    SR: {
        path: '/dashboards/sr',
        permission: 'sr_dashboard'
    },
    SR_LIST: {
        path: '/dashboards/sr/sr-list/:status',
        permission: 'sr_dashboard'
    }
}

export const MODULE_ROUTES = [
    {
        path: DASHBOARD_ROUTES.PROJECT.path,
        component: () => import(`/src/modules/dashboards/pms/views/Project.jsx`),
        permission: DASHBOARD_ROUTES.PROJECT.permission,
    },
    {
        path: DASHBOARD_ROUTES.BI.path,
        component: () => import(`/src/modules/dashboards/bi/views/BiDashboard.jsx`),
        permission:DASHBOARD_ROUTES.BI.permission,
    },
    {
        path: DASHBOARD_ROUTES.CIO.path,
        component: () => import(`/src/modules/dashboards/cio/views/CioDashboard.jsx`),
        permission:DASHBOARD_ROUTES.CIO.permission,
    },
    {
        path: DASHBOARD_ROUTES.CS.path,
        component: () => import(`/src/modules/dashboards/cs/views/CsDashboard.jsx`),
        permission:DASHBOARD_ROUTES.CS.permission,
    },
    {
        path: DASHBOARD_ROUTES.SUBSCRIPTION.path,
        component:()=>import(`/src/modules/dashboards/sms/views/SubscriptionDashboard.jsx`),
    },
    {
        path: DASHBOARD_ROUTES.SR.path,
        component: () => import(`/src/modules/dashboards/sr/views/SrDashboard.jsx`),
        permission: DASHBOARD_ROUTES.SR.permission,
    },
    {
        path: DASHBOARD_ROUTES.SR_LIST.path,
        component: () => import(`/src/modules/dashboards/sr/views/SrList.jsx`),
        permission: DASHBOARD_ROUTES.SR_LIST.permission,

    }
];
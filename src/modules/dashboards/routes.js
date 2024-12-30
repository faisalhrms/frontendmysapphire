export const DASHBOARD_ROUTES = {
    PROJECT: {
        path: '/dashboards/project-management-system',
        permission: 'dashboard_pms',

    },
    BI: {
        path: '/dashboards/business-intelligence',
        permission: 'dashboard_bi',
    },
    CIO: {
        path: '/dashboards/chief-information-officer',
        permission: 'dashboard_cio',
    },
    CS: {
        path: '/dashboards/cyber-security',
        permission: 'dashboard_cs',
    },
    SUBSCRIPTION: {
        path: '/dashboards/subscription',
        // permission:'dashboard_sms'
    },
    SR: {
        path: '/dashboards/sr',
        permission: 'dashboard_sr'
    },
    SR_LIST: {
        path: '/dashboards/sr/sr-list/:status',
        permission: 'dashboard_sr'
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
        permission: DASHBOARD_ROUTES.BI.permission,
    },
    {
        path: DASHBOARD_ROUTES.CIO.path,
        component: () => import(`/src/modules/dashboards/cio/views/CioDashboard.jsx`),
        permission: DASHBOARD_ROUTES.CIO.permission,
    },
    {
        path: DASHBOARD_ROUTES.CS.path,
        component: () => import(`/src/modules/dashboards/cs/views/CsDashboard.jsx`),
        permission: DASHBOARD_ROUTES.CS.permission,
    },
    {
        path: DASHBOARD_ROUTES.SUBSCRIPTION.path,
        component: () => import(`/src/modules/dashboards/sms/views/SubscriptionDashboard.jsx`),
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
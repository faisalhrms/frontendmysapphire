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
    },
    Equipment:{
        path:'dashboards/equipment',
        permission:'it_equipment_dashboard',
    },
    SFD:{
        path:'dashboards/srd',
        permission:'it_salesforce_dashboard',
    },

}

export const MODULE_ROUTES = [
    {
        path: DASHBOARD_ROUTES.PROJECT.path,
        component: () => import(`@modules/dashboards/pms/views/ProjectDashboard.jsx`),
        permission: DASHBOARD_ROUTES.PROJECT.permission,
    },
    {
        path: DASHBOARD_ROUTES.BI.path,
        component: () => import(`@modules/dashboards/bi/views/BiDashboard.jsx`),
        permission:DASHBOARD_ROUTES.BI.permission,
    },
    {
        path: DASHBOARD_ROUTES.CIO.path,
        component: () => import(`@modules/dashboards/cio/views/CioDashboard.jsx`),
        permission:DASHBOARD_ROUTES.CIO.permission,
    },
    {
        path: DASHBOARD_ROUTES.CS.path,
        component: () => import(`@modules/dashboards/cs/views/CsDashboard.jsx`),
        permission:DASHBOARD_ROUTES.CS.permission,
    },
    {
        path: DASHBOARD_ROUTES.SUBSCRIPTION.path,
        component:()=>import(`@modules/dashboards/sms/views/SubscriptionDashboard.jsx`),
    },
    {
        path: DASHBOARD_ROUTES.SR.path,
        component: () => import(`@modules/dashboards/sr/views/SrTabs.jsx`),
        permission: DASHBOARD_ROUTES.SR.permission,
    },
    {
        path: DASHBOARD_ROUTES.SR_LIST.path,
        component: () => import(`@modules/dashboards/sr/views/SrList.jsx`),
        permission: DASHBOARD_ROUTES.SR_LIST.permission,

    },
    {
        path: DASHBOARD_ROUTES.Equipment.path,
        component: () => import(`@modules/dashboards/eq/views/EquipmentDashboard.jsx`),
        permission: DASHBOARD_ROUTES.Equipment.permission,

    },
    {
        path: DASHBOARD_ROUTES.SFD.path,
        component: () => import(`@modules/dashboards/sfd/views/ExecutiveTabs.jsx`),
        permission: DASHBOARD_ROUTES.SFD.permission,

    },


];


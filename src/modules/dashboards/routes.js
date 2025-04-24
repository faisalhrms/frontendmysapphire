import ProjectDashboard from '@modules/dashboards/pms/views/ProjectDashboard.jsx';
import BiDashboard from '@modules/dashboards/bi/views/BiDashboard.jsx';
import CioDashboard from '@modules/dashboards/cio/views/CioDashboard.jsx';
import CsDashboard from '@modules/dashboards/cs/views/CsDashboard.jsx';
import SubscriptionDashboard from '@modules/dashboards/sms/views/SubscriptionDashboard.jsx';
import SrTabs from '@modules/dashboards/sr/views/SrTabs.jsx';
import SrList from '@modules/dashboards/sr/views/SrList.jsx';
import EquipmentDashboard from '@modules/dashboards/eq/views/EquipmentDashboard.jsx';
import CardDasboard from "./ CEODashboard/views/CardDasboard.jsx";

export const DASHBOARD_ROUTES = {
    PROJECT: {
        path: '/dashboards/project-management-system',
        permission: 'auth.pms_dashboard',
    },
    BI: {
        path: '/dashboards/business-intelligence',
        permission: 'bi_dashboard',
    },
    CIO: {
        path: '/dashboards/chief-information-officer',
        permission: 'cio_dashboard',
    },
    CS: {
        path: '/dashboards/cyber-security',
        permission: 'cs_dashboard',
    },
    SUBSCRIPTION: {
        path: '/dashboards/subscription',
        permission: 'auth.sms_dashboard',
    },
    SR: {
        path: '/dashboards/sr',
        permission: 'auth.sr_dashboard',
    },
    SR_LIST: {
        path: '/dashboards/sr/sr-list/:status',
        permission: 'auth.sr_dashboard',
    },
    Equipment: {
        path: '/dashboards/asset',
        permission: 'auth.it_equipment_dashboard',
    },
    CEO: {
        path: '/dashboards/eco',
        permission: 'auth.view_ceo_dashboard',

    },

};

export const MODULE_ROUTES = [
    {
        path: DASHBOARD_ROUTES.PROJECT.path,
        component: ProjectDashboard,
        permission: DASHBOARD_ROUTES.PROJECT.permission,
    },
    {
        path: DASHBOARD_ROUTES.BI.path,
        component: BiDashboard,
        permission: DASHBOARD_ROUTES.BI.permission,
    },
    {
        path: DASHBOARD_ROUTES.CIO.path,
        component: CioDashboard,
        permission: DASHBOARD_ROUTES.CIO.permission,
    },
    {
        path: DASHBOARD_ROUTES.CS.path,
        component: CsDashboard,
        permission: DASHBOARD_ROUTES.CS.permission,
    },
    {
        path: DASHBOARD_ROUTES.SUBSCRIPTION.path,
        component: SubscriptionDashboard,
    },
    {
        path: DASHBOARD_ROUTES.SR.path,
        component: SrTabs,
        permission: DASHBOARD_ROUTES.SR.permission,
    },
    {
        path: DASHBOARD_ROUTES.SR_LIST.path,
        component: SrList,
        permission: DASHBOARD_ROUTES.SR_LIST.permission,
    },
    {
        path: DASHBOARD_ROUTES.Equipment.path,
        component: EquipmentDashboard,
        permission: DASHBOARD_ROUTES.Equipment.permission,
    },
    {
        path: DASHBOARD_ROUTES.CEO.path,
        component: CardDasboard,
        permission: DASHBOARD_ROUTES.CEO.permission,
    },

];

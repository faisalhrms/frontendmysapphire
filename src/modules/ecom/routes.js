import OrderShopify from "@modules/ecom/views/OrderShopify.jsx";
import AnalysisReport from "@modules/ecom/views/AnalysisReport.jsx";
import ExecutiveTabs from "@modules/ecom/views/ExecutiveTabs.jsx";
import ObjectiveSpend from "../../modules/ecom/views/ObjectiveSpend.jsx"

export const ECOM_ROUTES = {
    READ: {
        path: "/module/ecom",
        permission: "view_ecommerce",
    },
    ADD: {
        path: "/module/ecom/anlysisReport",
        permission: "ecom_analytics",
    },
    SFD: {
        path: '/module/ecom/salesforcedashboard',
        permission: 'ecom_salesforce_dashboard',
    },
    OS:{
        path: '/module/ecom/digitalspent',
        permission: 'ecom_digitalspent',
    }

};

export const MODULE_ROUTES = [
    {
        path: ECOM_ROUTES.READ.path,
        component: OrderShopify,
        permission: ECOM_ROUTES.READ.permission,
    },
    {
        path: ECOM_ROUTES.ADD.path,
        component: AnalysisReport,
        permission: ECOM_ROUTES.ADD.permission,
    },
    {
        path: ECOM_ROUTES.SFD.path,
        component: ExecutiveTabs,
        permission: ECOM_ROUTES.SFD.permission,
    },
    {
        path: ECOM_ROUTES.OS.path,
        component: ObjectiveSpend,
        permission: ECOM_ROUTES.OS.permission,
    },

];

import OrderShopify from "@modules/ecom/views/OrderShopify.jsx";
import AnalysisReport from "@modules/ecom/views/AnalysisReport.jsx";
import ExecutiveTabs from "@modules/ecom/views/ExecutiveTabs.jsx";
import ObjectiveSpend from "@modules/ecom/views/ObjectiveSpend.jsx"
import InventoryRecon from "@modules/ecom/views/InventoryRecon.jsx";

export const ECOM_ROUTES = {
    READ: {
        path: "/module/ecom",
        permission: "auth.view_ecommerce",
    },
    ADD: {
        path: "/module/ecom/anlysisReport",
        permission: "auth.ecom_analytics",
    },
    SFD: {
        path: '/module/ecom/salesforcedashboard',
        permission: 'auth.ecom_salesforce_dashboard',
    },
    OS:{
        path: '/module/ecom/digitalspent',
        permission: 'auth.ecom_digitalspent',
    },
    IR:{
        path: '/module/ecom/inventory-recon',
        permission: 'auth.inventory_recon',
    },
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
    {
        path: ECOM_ROUTES.IR.path,
        component: InventoryRecon,
        permission: ECOM_ROUTES.OS.permission,
    },

];

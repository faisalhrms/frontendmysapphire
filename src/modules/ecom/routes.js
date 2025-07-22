import AnalysisReport from "@modules/ecom/views/AnalysisReport.jsx";
import ExecutiveTabs from "@modules/ecom/views/ExecutiveTabs.jsx";
import DigitalSpent from "@modules/ecom/views/DigitalSpent.jsx";
import InventoryRecon from "@modules/ecom/views/InventoryRecon.jsx";
import EcomWeeklyReport from "@modules/ecom/views/EcomWeeklyReport.jsx";
import PendingLiabilities from "@modules/ecom/views/PendingLiabilities.jsx";

export const ECOM_ROUTES = {
    // READ: {
    //     path: "/module/ecom",
    //     permission: "auth.view_ecommerce",
    // },
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
        permission: 'auth.ecom_inventory_recon',
    },
    WR:{
        path: '/module/ecom/weekly-report',
        permission: 'auth.ecom_weekly_report',
    },
    PL:{
        path: '/module/ecom/pending-liabilities',
        permission: 'auth.ecom_salesforce_dashboard',
    }
};

export const MODULE_ROUTES = [
    // {
    //     path: ECOM_ROUTES.READ.path,
    //     component: OrderShopify,
    //     permission: ECOM_ROUTES.READ.permission,
    // },
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
        component: DigitalSpent,
        permission: ECOM_ROUTES.OS.permission,
    },
    {
        path: ECOM_ROUTES.IR.path,
        component: InventoryRecon,
        permission: ECOM_ROUTES.OS.permission,
    },
    {
        path: ECOM_ROUTES.WR.path,
        component: EcomWeeklyReport,
        permission: ECOM_ROUTES.WR.permission,
    },
    {
        path: ECOM_ROUTES.PL.path,
        component: PendingLiabilities,
        permission: ECOM_ROUTES.PL.permission,
    }

];

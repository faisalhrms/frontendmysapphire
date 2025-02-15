import OrderShopify from "@modules/ecom/views/OrderShopify.jsx";
import AnalysisReport from "@modules/ecom/views/AnalysisReport.jsx";

export const ECOM_ROUTES = {
    READ: {
        path: "/module/ecom",
        permission: "view_ecommerce",
    },
    ADD: {
        path: "/module/ecom/anlysisReport",
        permission: "ecom_analytics",
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
];

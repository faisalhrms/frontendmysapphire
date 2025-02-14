import { INVENTORY_ROUTES } from "@modules/inventory/routes.js";

export const ECOM_ROUTES = {
    READ: {
        path: "/module/ecom",
        permission: "view_ecommerce",
    },
    ADD: {
        path: "/module/ecom/anlysisReport",
        permission: "add_ecommerce",
    }
};

export const MODULE_ROUTES = [
    {
        path: ECOM_ROUTES.READ.path,
        component: () => import("/src/modules/ecom/views/OrderShopify.jsx"),
        permission: ECOM_ROUTES.READ.permission,
    },
    {
        path: ECOM_ROUTES.ADD.path,
        component: () => import("/src/modules/ecom/views/AnalysisReport.jsx"),
        permission: ECOM_ROUTES.ADD.permission,
    },
];

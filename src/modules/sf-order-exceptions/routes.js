import SalesForceOrderExceptionReport from "@modules/sf-order-exceptions/views/SalesForceOrderExceptionReport.jsx";
import SalesForceOrderStatusReport from "@modules/sf-order-exceptions/views/SalesForceOrderStatusReport.jsx";

export const SF_ORDER_EXCEPTION_ROUTES = {
    ORDER_EXCEPTIONS: {
        path: "/module/sales-force/order-exceptions",
        permission: "auth.sf_order_exceptions",
    },
    ORDER_STATUS:{
        path: '/module/sales-force/order-status',
        permission: 'auth.sf_order_status',
    },
};

export const MODULE_ROUTES = [
    {
        path: SF_ORDER_EXCEPTION_ROUTES.ORDER_EXCEPTIONS.path,
        component: SalesForceOrderExceptionReport,
        permission: SF_ORDER_EXCEPTION_ROUTES.ORDER_EXCEPTIONS.permission,
    },
    {
        path: SF_ORDER_EXCEPTION_ROUTES.ORDER_STATUS.path,
        component: SalesForceOrderStatusReport,
    },
];

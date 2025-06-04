import SalesForceOrderExceptionReport from "@modules/sf-order-exceptions/views/SalesForceOrderExceptionReport.jsx";

export const SF_ORDER_EXCEPTION_ROUTES = {
    ORDER_EXCEPTIONS: {
        path: "/module/sales-force/order-exceptions",
        permission: "auth.sf_order_exceptions",
    },
};

export const MODULE_ROUTES = [
    {
        path: SF_ORDER_EXCEPTION_ROUTES.ORDER_EXCEPTIONS.path,
        component: SalesForceOrderExceptionReport,
        permission: SF_ORDER_EXCEPTION_ROUTES.ORDER_EXCEPTIONS.permission,
    },
];

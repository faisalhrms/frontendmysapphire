import QrGenerator from "@modules/qr-generator/views/QrGenerator.jsx";

import QRCustomize from "@modules/qr-generator/components/QrLink/QRCustomize.jsx";

export const QR_ROUTES = {
    LINK: {
        path: "/module/qr/qr-link",
        permission: 'user.view_ess_modules',
    },
    CUSTOMIZE: {
        path: "/module/qr/qr-customize",
        permission: 'user.view_ess_modules',
    }
};

export const MODULE_ROUTES = [
    {
        path: QR_ROUTES.LINK.path,
        component: QrGenerator,
        permission: QR_ROUTES.LINK.permission
    },
    {
        path: QR_ROUTES.CUSTOMIZE.path,
        component: QRCustomize,
        permission: QR_ROUTES.LINK.permission
    },
];
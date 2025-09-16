import QrGenerator from "@modules/qr-generator/views/QrGenerator.jsx";

import QRCustomize from "@modules/qr-generator/components/QrLink/QRCustomize.jsx";

export const QR_ROUTES = {
    LINK: {
        path: "/module/qr/qr-link",
        permission: 'qr.add_qr_link',

    },
    CUSTOMIZE: {
        path: "/module/qr/qr-customize",
        permission: 'qr.create_qr',
    }
};

export const MODULE_ROUTES = [
    {
        path: QR_ROUTES.LINK.path,
        component: QrGenerator,
    },
    {
        path: QR_ROUTES.CUSTOMIZE.path,
        component: QRCustomize,
    },
];
import QrGenerator from "@modules/qr-generator/views/QrGenerator.jsx";


export const QR_ROUTES = {
    ADD: {
        path: "/module/qr/qr-link",
    }

};

export const MODULE_ROUTES = [

    {
        path: QR_ROUTES.ADD.path,
        component:QrGenerator ,
    },


];

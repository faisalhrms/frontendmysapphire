import oci from "./views/Oci.jsx";


export const DUMS_ROUTES = {
    CREATE: {
        path: "/module/dumps/oci",
        permission:"auth.view_oci",


    },
};

export const MODULE_ROUTES = [
    {
        path: DUMS_ROUTES.CREATE.path,
        component: oci,
        permission: DUMS_ROUTES.CREATE.permission,
    },
];

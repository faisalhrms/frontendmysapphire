import oci from "./views/Oci.jsx";
import Oms from "@modules/dumps/views/Oms.jsx";


export const DUMS_ROUTES = {
    CREATE: {
        path: "/module/dumps/oci",
        permission:"auth.view_oci_dumps",


    },
    READ: {
        path: "/module/dumps/oms",
        permission:"auth.view_oms_dumps",


    },
};

export const MODULE_ROUTES = [
    {
        path: DUMS_ROUTES.CREATE.path,
        component: oci,
        permission: DUMS_ROUTES.CREATE.permission,
    },
    {
        path: DUMS_ROUTES.READ.path,
        component: Oms,
        permission: DUMS_ROUTES.READ.permission,
    },
];

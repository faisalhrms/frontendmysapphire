import Lms from "@modules/lms/views/Lms.jsx";
import Listing from "@modules/lms/views/Listing.jsx";


export const LMS_ROUTES = {
    CREATE: {
        path: '/module/lms/course',

    },
    READ: {
        path: '/module/lms/listing',

    },

};

export const MODULE_ROUTES = [
    {
        path: LMS_ROUTES.CREATE.path,
        component: Lms,
    },
    {
        path: LMS_ROUTES.READ.path,
        component: Listing,
    },
];


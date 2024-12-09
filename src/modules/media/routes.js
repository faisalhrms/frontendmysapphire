export const MEDIA_ROUTES = {
    READ: {
        path: '/module/media',
    }
};

export const MODULE_ROUTES = [
    {
        path: MEDIA_ROUTES.READ.path,
        component: () => import(`/src/modules/media/views/Media.jsx`),
    },
]
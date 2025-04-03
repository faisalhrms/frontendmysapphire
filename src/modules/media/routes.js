import Media from '@modules/media/views/Media.jsx';

export const MEDIA_ROUTES = {
    READ: {
        path: '/module/media',
    },
};

export const MODULE_ROUTES = [
    {
        path: MEDIA_ROUTES.READ.path,
        component: Media,
    },
];

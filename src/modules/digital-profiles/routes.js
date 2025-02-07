export const DIGITAL_PROFILES_ROUTES = {
    READ: {
        path: "/module/digital/profiles",
        permission: "view_digital_profiles",
    },
    CREATE: {
        path: '/module/digital/profiles/add/',
    },
    EDIT: {
        path: '/module/digital/profiles/edit',

    },
};

export const MODULE_ROUTES = [
    {
        path: DIGITAL_PROFILES_ROUTES.READ.path,
        component: () =>
            import('@modules/digital-profiles/views/DigitalProfilesList.jsx'),
        permission: DIGITAL_PROFILES_ROUTES.READ.permission,
    },
    {
        path: DIGITAL_PROFILES_ROUTES.CREATE.path,
        component: () => import('@modules/digital-profiles/component/DigitalProfileForm.jsx'),
    },
    {
        path: DIGITAL_PROFILES_ROUTES.EDIT.path,
        component: () => import('@modules/digital-profiles/views/DigitalProfileEdit.jsx'),
    },
];

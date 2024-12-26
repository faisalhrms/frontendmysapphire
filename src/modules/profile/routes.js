export const PROFILE_ROUTES = {
    READ: {
        path: '/pages/profile',
        // permission: 'view_user',
    },


};

export const MODULE_ROUTES = [
    {
        path: PROFILE_ROUTES.READ.path,
        component: () => import(`/src/modules/profile/views/UserProfile.jsx`),
        // permission: USER_ROUTES.READ.permission,
    },

];
import UserProfile from '@modules/profile/views/UserProfile.jsx';

export const PROFILE_ROUTES = {
    READ: {
        path: '/pages/profile',
    },
};

export const MODULE_ROUTES = [
    {
        path: PROFILE_ROUTES.READ.path,
        component: UserProfile,
    },
];

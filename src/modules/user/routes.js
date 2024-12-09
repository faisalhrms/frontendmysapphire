export const USER_ROUTES = {
    READ: {
        path: '/module/users',
        permission: 'user_read',
    },
    EDIT: {
        path: '/module/users/edit/:id',
        permission: 'user_update',
    },
};

export const MODULE_ROUTES = [
    {
        path: USER_ROUTES.READ.path,
        component: () => import(`/src/modules/user/views/UserList.jsx`),
        permission: USER_ROUTES.READ.permission,
    },
    {
        path: USER_ROUTES.EDIT.path,
        component: () => import(`/src/modules/user/views/UserEdit.jsx`),
        permission: USER_ROUTES.EDIT.permission,
    },
];
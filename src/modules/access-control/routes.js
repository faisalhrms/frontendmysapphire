export const ACCESS_CONTROL_ROUTES = {
    ROLE: {
        READ: {
            path: '/module/users/roles',
             permission: 'view_group',
        }
    },
    PERMISSION: {
        READ: {
            path: '/module/users/permissions',
             permission: 'view_permission',
        },
        GRANT:{
            path: '/module/users/roles/:id/permissions',

        }
    },
};

export const MODULE_ROUTES = [
    {
        path: ACCESS_CONTROL_ROUTES.ROLE.READ.path,
        component: () => import(`@modules/access-control/role/views/RoleList.jsx`),
        permission: ACCESS_CONTROL_ROUTES.ROLE.READ.permission,
    },
    {
        path: ACCESS_CONTROL_ROUTES.PERMISSION.READ.path,
        component: () => import(`@modules/access-control/permission/views/PermissionList.jsx`),
        permission: ACCESS_CONTROL_ROUTES.PERMISSION.READ.permission,
    },
    {
        path: ACCESS_CONTROL_ROUTES.PERMISSION.GRANT.path,
        component: () => import(`@modules/access-control/permission/views/GrantPermission.jsx`),
    },
];
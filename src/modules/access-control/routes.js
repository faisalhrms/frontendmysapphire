import RoleList from '@modules/access-control/role/views/RoleList.jsx';
import PermissionList from '@modules/access-control/permission/views/PermissionList.jsx';
import GrantPermission from '@modules/access-control/permission/views/GrantPermission.jsx';

export const ACCESS_CONTROL_ROUTES = {
    ROLE: {
        READ: {
            path: '/module/users/roles',
            permission: 'auth.view_group',
        },
    },
    PERMISSION: {
        READ: {
            path: '/module/users/permissions',
            permission: 'auth.view_permission',
        },
        GRANT: {
            path: '/module/users/roles/:id/permissions',
            permission: 'auth.manage_permission',
        },
    },
};

export const MODULE_ROUTES = [
    {
        path: ACCESS_CONTROL_ROUTES.ROLE.READ.path,
        component: RoleList,
        permission: ACCESS_CONTROL_ROUTES.ROLE.READ.permission,
    },
    {
        path: ACCESS_CONTROL_ROUTES.PERMISSION.READ.path,
        component: PermissionList,
        permission: ACCESS_CONTROL_ROUTES.PERMISSION.READ.permission,
    },
    {
        path: ACCESS_CONTROL_ROUTES.PERMISSION.GRANT.path,
        component: GrantPermission,
        permission: ACCESS_CONTROL_ROUTES.PERMISSION.GRANT.permission,
    },
];

import RoleList from '@modules/access-control/role/views/RoleList.jsx';
import PermissionList from '@modules/access-control/permission/views/PermissionList.jsx';
import GrantPermission from '@modules/access-control/permission/views/GrantPermission.jsx';
import PermissionDetail from "@modules/access-control/permission/components/PermissionDetail.jsx";
import RoleDetail from "@modules/access-control/role/components/RoleDetail.jsx";

export const ACCESS_CONTROL_ROUTES = {
    ROLE: {
        READ: {
            path: '/module/users/roles',
            permission: 'auth.view_group',
        },
        DETAIL:{
            path: '/module/users/roles/details', // Changed from path param to query param
            queryParam: 'ids' // New query parameter key
        }
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
        DETAIL: {
            path: '/module/users/permissions/details', // Changed from path param to query param
            queryParam: 'ids' // New query parameter key
        }
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
    {
        path:ACCESS_CONTROL_ROUTES.PERMISSION.DETAIL.path,
        component:PermissionDetail
    },
    {
        path:ACCESS_CONTROL_ROUTES.ROLE.DETAIL.path,
        component:RoleDetail
    }
];

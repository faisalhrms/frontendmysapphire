import UserList from '@modules/user/views/UserList.jsx';
import UserEdit from '@modules/user/views/UserEdit.jsx';
import UserCreate from '@modules/user/views/UserCreate.jsx';
import UserManagementList from "@modules/user/views/UserManagementList.jsx";
import UserManagementForm   from "@modules/user/components/UserManagementForm.jsx";
import UserManagementEdit from "@modules/user/views/UserManagementEdit.jsx";
import OtherUserList from "@modules/user/views/OtherUserList.jsx";
import OtherUserCreate from "@modules/user/views/OtherUserCreate.jsx";
import OtherUserEdit from "@modules/user/views/OtherUserEdit.jsx";
import UserManagementCreate from "@modules/user/views/UserManagementCreate.jsx";
export const USER_ROUTES = {
    READ: {
        path: '/module/users',
        permission: 'user.view_user',
    },
    EDIT: {
        path: '/module/users/edit/:id',
        permission: 'user.change_user',
    },
    CREATE: {
        path: '/module/users/create',
        permission: 'user.add_user',
    },
    USER_MANAGEMENT:{
        READ:{
            path:'/module/user-management/list',
            // permission:'view_user_management',
        },
        EDIT:{
            path:'/module/user-management/edit/:id',
            // permission:'edit_user_management',
        },
        CREATE: {
            path: '/module/user-management/create/:id',
            // permission:'create_user_management',
        }
    },
    OTHER_USER:{
        READ:{
            path:'/module/users/others',
            permission: 'user.view_user',
        },
        CREATE:{
            path:'/module/users/others/create',
            permission: 'user.add_user',
        },
        EDIT:{
            path:'/module/users/others/:id',
            permission: 'user.change_user',
        },
    }
};

export const MODULE_ROUTES = [
    {
        path: USER_ROUTES.READ.path,
        component: UserList,
        permission: USER_ROUTES.READ.permission,
    },
    {
        path: USER_ROUTES.EDIT.path,
        component: UserEdit,
        permission: USER_ROUTES.EDIT.permission,
    },
    {
        path: USER_ROUTES.CREATE.path,
        component: UserCreate,
        permission: USER_ROUTES.CREATE.permission,
    },
    {
        path:USER_ROUTES.USER_MANAGEMENT.READ.path,
        component:UserManagementList,
         permission: USER_ROUTES.USER_MANAGEMENT.permission,
    },
    {
        path: USER_ROUTES.USER_MANAGEMENT.EDIT.path,
        component:UserManagementEdit,
    },
    {
        path: USER_ROUTES.USER_MANAGEMENT.CREATE.path,
        component: UserManagementCreate,
    },
    {
        path: USER_ROUTES.OTHER_USER.READ.path,
        component: OtherUserList,
        permission: USER_ROUTES.OTHER_USER.READ.permission,
    },
    {
        path: USER_ROUTES.OTHER_USER.CREATE.path,
        component: OtherUserCreate,
        permission: USER_ROUTES.OTHER_USER.CREATE.permission,
    },
    {
        path: USER_ROUTES.OTHER_USER.EDIT.path,
        component: OtherUserEdit,
        permission: USER_ROUTES.OTHER_USER.EDIT.permission,
    }
];

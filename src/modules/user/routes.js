import UserList from '@modules/user/views/UserList.jsx';
import UserEdit from '@modules/user/views/UserEdit.jsx';
import UserCreate from '@modules/user/views/UserCreate.jsx';

export const USER_ROUTES = {
    READ: {
        path: '/module/users',
        permission: 'view_user',
    },
    EDIT: {
        path: '/module/users/edit/:id',
        permission: 'change_user',
    },
    CREATE: {
        path: '/module/users/create',
        permission: 'add_user',
    },
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
];

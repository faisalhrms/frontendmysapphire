export const SETUP_ROUTES = {
    COMPANY: {
        READ: {
            path: '/module/setup',
            permission: 'view_company',
        },
        CREATE: {
            path: '/module/setup/add/',
            permission: 'add_company',
        },
        EDIT: {
            path: '/module/setup/edit',
            permission: 'change_company',

        },
    },
    SR_TYPE: {
        READ: {
            path: '/module/sr',
            permission: 'view_srtype',
        },
        CREATE: {
            path: '/module/sr/add/',
            permission: 'create_srtype',
        },
        EDIT: {
            path: '/module/sr/edit',
            permission: 'change_srtype',
        },
    },
};

export const MODULE_ROUTES = [
    {
        path: SETUP_ROUTES.COMPANY.READ.path,
        component: () => import('@modules/setup/views/CompanyList.jsx'),
    },
    {
        path: SETUP_ROUTES.COMPANY.CREATE.path,
        component: () => import('@modules/setup/components/CompanyForm.jsx'),
    },
    {
        path: SETUP_ROUTES.COMPANY.EDIT.path,
        component: () => import('@modules/setup/views/CompanyEdit.jsx'),
    },
    {
        path: SETUP_ROUTES.SR_TYPE.READ.path,
        component: () => import('@modules/setup/views/SrTypeList.jsx'),
    },
    {
        path: SETUP_ROUTES.SR_TYPE.CREATE.path,
        component: () => import('@modules/setup/views/SrTypes.jsx'),
    },
    {
        path: SETUP_ROUTES.SR_TYPE.EDIT.path,
        component: () => import('@modules/setup/views/SrTypesEdit.jsx'),
    },
];
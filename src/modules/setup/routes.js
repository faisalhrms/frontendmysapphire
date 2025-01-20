export const SETUP_ROUTES = {
        READ: {
            path: '/module/setup',
        },
        ADD: {
            path: '/module/setup/add/',

        },
       EDIT:{
        path:'/module/setup/edit',
       },
       

    };

    export const MODULE_ROUTES = [
        {
            path: SETUP_ROUTES.READ.path,
            component: () => import("@modules/setup/views/CompanyList.jsx"),
        },
        {
            path: SETUP_ROUTES.ADD.path,
            component: () => import('@modules/setup/views/CompanyEdit.jsx'),
        },
        {
            path: SETUP_ROUTES.EDIT.path,
            component: () => import('@modules/setup/views/CompanyEdit.jsx'),

        },


    ];
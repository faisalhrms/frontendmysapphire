export const SUBSCRIPTION_ROUTES = {
    READ: {
        path: '/module/subscription',
        // permission: 'subscription_read',

},
    CREATE: {
        path: '/module/subscription/create',
        // permission: 'subscription_create',

    },
    EDIT: {
        path: '/module/subscription/edit/:id',
        // permission: 'subscription_update',

    },
    FILTER: {
        path: "/subscriptions?filter=:type", // Dynamic filter route
    },
    
    DETAIL: {
        path: '/module/subscription/detail/:id',
    },
  
};

export const MODULE_ROUTES = [
    {
        path: SUBSCRIPTION_ROUTES.READ.path,
        component: () => import(`/src/modules/subscription/views/SubscriptionList.jsx`),
        permission:SUBSCRIPTION_ROUTES.READ.permission,
    },
    {
        path: SUBSCRIPTION_ROUTES.CREATE.path,
        component: () => import(`/src/modules/subscription/views/SubscriptionCreate.jsx`),
        permission:SUBSCRIPTION_ROUTES.CREATE.permission,
    },
    {
        path: SUBSCRIPTION_ROUTES.EDIT.path,
        component: () => import(`/src/modules/subscription/views/SubscriptionEdit.jsx`),
        permission:SUBSCRIPTION_ROUTES.EDIT.permission,
    },
    {
        path: SUBSCRIPTION_ROUTES.DETAIL.path,
        component: () => import(`/src/modules/subscription/views/SubscriptionDetail.jsx`),
        permission:SUBSCRIPTION_ROUTES.READ.permission,
    },
  
  
]
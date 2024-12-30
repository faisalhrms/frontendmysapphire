export const SUBSCRIPTION_ROUTES = {
    READ: {
        path: '/module/subscription',
         permission: 'view_subscription',

},
    CREATE: {
        path: '/module/subscription/create',
      permission: 'add_subscription',

    },
    EDIT: {
        path: '/module/subscription/edit/:id',
      permission: 'change_subscription',

    },
    FILTER: {
        path: "/subscriptions?filter=:type",
    },
    RENEW:{
      path:'/module/subscription/renew/:id',
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
    {
        path:SUBSCRIPTION_ROUTES.RENEW.path,
        component:()=>import(`/src/modules/subscription/views/SubscriptionRenew.jsx`),
    }
  
  
]
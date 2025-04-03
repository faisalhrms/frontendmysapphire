import SubscriptionList from '@modules/subscription/views/SubscriptionList.jsx';
import SubscriptionCreate from '@modules/subscription/views/SubscriptionCreate.jsx';
import SubscriptionEdit from '@modules/subscription/views/SubscriptionEdit.jsx';
import SubscriptionDetail from '@modules/subscription/views/SubscriptionDetail.jsx';
import SubscriptionRenew from '@modules/subscription/views/SubscriptionRenew.jsx';

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
    RENEW: {
        path: '/module/subscription/renew/:id',
    },
    DETAIL: {
        path: '/module/subscription/detail/:id',
    },
};

export const MODULE_ROUTES = [
    {
        path: SUBSCRIPTION_ROUTES.READ.path,
        component: SubscriptionList,
        permission: SUBSCRIPTION_ROUTES.READ.permission,
    },
    {
        path: SUBSCRIPTION_ROUTES.CREATE.path,
        component: SubscriptionCreate,
        permission: SUBSCRIPTION_ROUTES.CREATE.permission,
    },
    {
        path: SUBSCRIPTION_ROUTES.EDIT.path,
        component: SubscriptionEdit,
        permission: SUBSCRIPTION_ROUTES.EDIT.permission,
    },
    {
        path: SUBSCRIPTION_ROUTES.DETAIL.path,
        component: SubscriptionDetail,
        permission: SUBSCRIPTION_ROUTES.READ.permission,
    },
    {
        path: SUBSCRIPTION_ROUTES.RENEW.path,
        component: SubscriptionRenew,
    },
];

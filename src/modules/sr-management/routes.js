export const SRM_ROUTES = {
    READ: {
        path: '/module/srm',
        permission: 'view_sr_management',
    },


    PENDING: {
        path: '/module/srm/taskpending/:id',
    },
    GENERATED: {
        path: '/module/srm/taskgeneratedform/:id',
    },
    COMPLETED: {
        path: '/module/srm/taskcompletedform/:id',
    },
    CLOSED: {
        path: '/module/srm/taskclosedform/:id',
    },


};

export const MODULE_ROUTES = [
    {
        path: SRM_ROUTES.READ.path,
        component: () => import(`@modules/sr-management/views/Sr.jsx`),
        permission: SRM_ROUTES.READ.permission,
    },

    {
        path: SRM_ROUTES.PENDING.path,
        component: () => import(`@modules/sr-management/pending-req-section/views/PendingReqTaskCreate.jsx`),
    },

    {
        path: SRM_ROUTES.GENERATED.path,
        component: () => import(`@modules/sr-management/task-genrated-section/views/TaskGeneratedView.jsx`),
    },

    {
        path: SRM_ROUTES.COMPLETED.path,
        component: () => import(`@modules/sr-management/completed-task-section/views/TaskCompletedView.jsx`),
    },
    {
        path: SRM_ROUTES.CLOSED.path,
        component: () => import(`@modules/sr-management/closed-task-section/views/TaskClosedView.jsx`),
    },


]
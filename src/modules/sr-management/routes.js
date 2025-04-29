import Sr from '@modules/sr-management/views/Sr.jsx';
import PendingReqTaskCreate from '@modules/sr-management/pending-req-section/views/PendingReqTaskCreate.jsx';
import TaskGeneratedView from '@modules/sr-management/task-genrated-section/views/TaskGeneratedView.jsx';
import TaskCompletedView from '@modules/sr-management/completed-task-section/views/TaskCompletedView.jsx';
import TaskClosedView from '@modules/sr-management/closed-task-section/views/TaskClosedView.jsx';

export const SRM_ROUTES = {
    READ: {
        path: '/module/srm',
        permission: 'auth.view_sr_management',
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
        component: Sr,
        permission: SRM_ROUTES.READ.permission,
    },
    {
        path: SRM_ROUTES.PENDING.path,
        component: PendingReqTaskCreate,
    },
    {
        path: SRM_ROUTES.GENERATED.path,
        component: TaskGeneratedView,
    },
    {
        path: SRM_ROUTES.COMPLETED.path,
        component: TaskCompletedView,
    },
    {
        path: SRM_ROUTES.CLOSED.path,
        component: TaskClosedView,
    },
];

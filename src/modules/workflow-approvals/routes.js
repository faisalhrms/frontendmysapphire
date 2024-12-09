export const WORKFLOW_ROUTES = {
    READ: {
        path: '/module/workflow/subscription/',
    },
};

export const MODULE_ROUTES = [
    {

        path: WORKFLOW_ROUTES.READ.path,
        component: () => import('./views/WorkflowSubscription.jsx'), 

    }]
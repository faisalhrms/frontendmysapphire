export const SRM_ROUTES = {
    READ: {
        path: '/module/srm',
<<<<<<< HEAD
     
=======
>>>>>>> 637cd0620fc6624b4a684c6ea66fd9d4b7f7bbdf
    

},
TASK:{
    path:'/module/srm/taskgenerated',
  

},

CREATE:{
    path:'/module/srm/createtask/:id',
  

},

COMPLETE:{
    path:'/module/srm/taskcompleteform',
  

},
GENERATED:{
    path:'/module/srm/taskgeneratedform/:id',
  

},

};

export const MODULE_ROUTES = [
    {
        path: SRM_ROUTES.READ.path,
        component: () => import(`/src/modules/sr-management/views/Sr.jsx`),
        permission: SRM_ROUTES.READ.permission,
    },
    {
        path: SRM_ROUTES.TASK.path,
        component: () => import(`/src/modules/sr-management/views/Tg.jsx`),
    },
   
    {
        path: SRM_ROUTES.CREATE.path,
        component: () => import(`/src/modules/sr-management/pending-req-section/views/PendingReqTaskCreate.jsx`),
    },
    {
        path: SRM_ROUTES.COMPLETE.path,
        component: () => import(`/src/modules/sr-management/views/TF.jsx`),
    },
    {
        path: SRM_ROUTES.GENERATED.path,
        component: () => import(`/src/modules/sr-management/task-genrated-section/views/TaskGeneratedView.jsx`),
    },

]
export const PMS_ROUTES = {
  PROJECT: {
    READ: {
      path: "/module/projects",
    },
    CREATE: {
      path: "/module/projects/create",
      permission: "add_project",
    },
    EDIT: {
      path: "/module/projects/edit/:id",
      permission: "change_project",
    },
    DETAIL: {
      path: "/module/projects/detail/:id",
    },
   
   
  },
  TASK: {
    DETAIL: {
      path: "/module/tasks/detail/:id",
    },
    KANBAN:{
      path: "/module/task/kanban-board"
    }
  },
};

export const MODULE_ROUTES = [
  {
    path: PMS_ROUTES.PROJECT.READ.path,
    component: () =>
      import(`/src/modules/project-management/views/ProjectList.jsx`),
  },
  {
    path: PMS_ROUTES.PROJECT.CREATE.path,
    component: () =>
      import(`/src/modules/project-management/views/ProjectCreate.jsx`),
    permission: PMS_ROUTES.PROJECT.CREATE.permission,
  },
  {
    path: PMS_ROUTES.PROJECT.EDIT.path,
    component: () =>
      import(`/src/modules/project-management/views/ProjectEdit.jsx`),
    permission: PMS_ROUTES.PROJECT.EDIT.permission,
  },
  {
    path: PMS_ROUTES.PROJECT.DETAIL.path,
    component: () =>
      import(`/src/modules/project-management/views/ProjectDetail.jsx`),
  },
  {
    path: PMS_ROUTES.TASK.DETAIL.path,
    component: () =>
      import(`/src/modules/project-management/views/TaskDetail.jsx`),
  },
  {
    path:PMS_ROUTES.TASK.KANBAN.path,
    component:()=>
        import(`/src/modules/project-management/views/TaskKanBan.jsx`),
  },
];

import ProjectList from '@modules/project-management/views/ProjectList.jsx';
import ProjectEcom from '@modules/project-management/views/ProjectsMilestonesTasksList.jsx';
import ProjectCreate from '@modules/project-management/views/ProjectCreate.jsx';
import ProjectEdit from '@modules/project-management/views/ProjectEdit.jsx';
import ProjectDetail from '@modules/project-management/views/ProjectDetail.jsx';
import TaskDetail from '@modules/project-management/views/TaskDetail.jsx';
import TaskKanban from '@modules/project-management/views/TaskKanban.jsx';
import TaskList from '@modules/project-management/views/TaskList.jsx';

export const PMS_ROUTES = {
  PROJECT: {
    READ: {
      path: "/module/projects",
      permission: "pms.view_project",
    },
    CREATE: {
      path: "/module/projects/create",
      permission: "pms.add_project",
    },
    EDIT: {
      path: "/module/projects/edit/:id",
      permission: "pms.change_project",
    },
    DETAIL: {
      path: "/module/projects/detail/:id",
      permission: "pms.view_project",
    },
  },
  TASK: {
    READ:{
      path: "/module/tasks",
      permission: "pms.view_task",
    },
    DETAIL: {
      path: "/module/tasks/detail/:id",
      permission: "pms.view_task",
    },
    KANBAN: {
      path: "/module/tasks/kanban-board",
      permission: "pms.view_task",
    },
    ECOM: {
      path: "/module/tasks/ecom",
      permission: 'pms.view_ecom_tasks',
    },
  },
};

export const MODULE_ROUTES = [
  {
    path: PMS_ROUTES.PROJECT.READ.path,
    component: ProjectList,
    permission: PMS_ROUTES.PROJECT.READ.permission,
  },
  {
    path: PMS_ROUTES.PROJECT.CREATE.path,
    component: ProjectCreate,
    permission: PMS_ROUTES.PROJECT.CREATE.permission,
  },
  {
    path: PMS_ROUTES.PROJECT.EDIT.path,
    component: ProjectEdit,
    permission: PMS_ROUTES.PROJECT.EDIT.permission,
  },
  {
    path: PMS_ROUTES.PROJECT.DETAIL.path,
    component: ProjectDetail,
    permission: PMS_ROUTES.PROJECT.READ.permission,
  },
  {
    path: PMS_ROUTES.TASK.DETAIL.path,
    component: TaskDetail,
    permission: PMS_ROUTES.TASK.READ.permission,
  },
  {
    path: PMS_ROUTES.TASK.KANBAN.path,
    component: TaskKanban,
    permission: PMS_ROUTES.TASK.READ.permission,
  },
  {
    path: PMS_ROUTES.TASK.READ.path,
    component: TaskList,
    permission: PMS_ROUTES.TASK.READ.permission,
  },
  {
    path: PMS_ROUTES.TASK.ECOM.path,
    component: ProjectEcom,
    permission: PMS_ROUTES.TASK.ECOM.permission,
  },
];

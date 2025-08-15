import YearSetup from '@modules/hrms/views/YearSetup.jsx';
import ApprovalSetup from "@modules/hrms/views/ApprovalSetup.jsx";
import ObjectiveList from "@modules/hrms/views/ObjectiveList.jsx";

export const HRMS_ROUTES = {
  SETUPS: {
    YEAR: {
      path: "/module/hrms/setups/year",
      permission: "hrms.manage_year_setup_form"
    },
    APPROVAL: {
      path: "/module/hrms/setups/approval-hierarchy",
      permission: "hrms.manage_approval_hierarchy_form"
    },

  },
  MANAGEMENT:{
    OBJECTIVE:{
      path: "/module/hrms/management/objective",
      permission: "hrms.manage_approval_hierarchy_form"
    }
  }
};

export const MODULE_ROUTES = [
  {
    path: HRMS_ROUTES.SETUPS.YEAR.path,
    component: YearSetup,
    permission: HRMS_ROUTES.SETUPS.YEAR.permission
  },
  {
    path: HRMS_ROUTES.SETUPS.APPROVAL.path,
    component: ApprovalSetup,
    permission: HRMS_ROUTES.SETUPS.APPROVAL.permission
  },
  {
    path:HRMS_ROUTES.MANAGEMENT.OBJECTIVE.path,
    component: ObjectiveList,
    permission: HRMS_ROUTES.SETUPS.OBJECTIVE.permission
  }
];

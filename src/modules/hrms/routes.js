import YearSetup from '@modules/hrms/views/YearSetup.jsx';
import ApprovalSetup from "@modules/hrms/views/ApprovalSetup.jsx";

export const HRMS_ROUTES = {
  SETUPS: {
    YEAR: {
      path: "/module/hrms/setups/year",
      permission: "hrms.manage_year_setup_form"
    },
    APPROVAL: {
      path: "/module/hrms/setups/approval-hierarchy",
      permission: "hrms.manage_year_setup_form"
    }
  },
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
  }
];

import YearSetup from '@modules/hrms/views/YearSetup.jsx';

export const HRMS_ROUTES = {
  SETUPS: {
    YEAR: {
      path: "/module/hrms/setups/year",
      permission: "hrms.manage_year_setup_form"
    },
  },
};

export const MODULE_ROUTES = [
  {
    path: HRMS_ROUTES.SETUPS.YEAR.path,
    component: YearSetup,
    permission: HRMS_ROUTES.SETUPS.YEAR.permission
  }
];

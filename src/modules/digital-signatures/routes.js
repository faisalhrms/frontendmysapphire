import { Create } from "@mui/icons-material";

export const DIGITAL_SIGNATURES_ROUTES = {
  READ: {
    path: "/module/signatures",
    permission: "view_digital_signature",
  },
};

export const MODULE_ROUTES = [
  {
    path: DIGITAL_SIGNATURES_ROUTES.READ.path,
    component: () =>
      import(`@modules/digital-signatures/views/DigitalSignatures.jsx`),
    permission: DIGITAL_SIGNATURES_ROUTES.READ.permission,
  },
];

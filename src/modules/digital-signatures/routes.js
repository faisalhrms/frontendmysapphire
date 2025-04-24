import DigitalSignatures from '@modules/digital-signatures/views/DigitalSignatures.jsx';

export const DIGITAL_SIGNATURES_ROUTES = {
  READ: {
    path: "/module/signatures",
    permission: "auth.view_digital_signature",
  },
};

export const MODULE_ROUTES = [
  {
    path: DIGITAL_SIGNATURES_ROUTES.READ.path,
    component: DigitalSignatures,
    permission: DIGITAL_SIGNATURES_ROUTES.READ.permission,
  },
];

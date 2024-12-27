import { Create } from "@mui/icons-material";

export const DIGITAL_SIGNATURES_ROUTES = {
    READ: {
        path: '/module/signatures',
      
    },
    
   
};

export const MODULE_ROUTES = [
    {
        path: DIGITAL_SIGNATURES_ROUTES.READ.path,
        component: () => import(`/src/modules/digital-signatures/views/DigitalSignatures.jsx`),

    },
   

]
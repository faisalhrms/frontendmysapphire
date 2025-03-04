import FieldDefinitionList from "@modules/beirholm-bi/views/FieldDefinitionList.jsx";
import FieldDefinitionForm from "@modules/beirholm-bi/components/FieldDefinitionForm.jsx";
import CorrectionRulesList from "@modules/beirholm-bi/views/CorrectionRulesList.jsx";
import CorrectionRulesForm from "@modules/beirholm-bi/components/CorrectionRulesForm.jsx";
import DataSanitizationList from "@modules/beirholm-bi/views/DataSanitizationList.jsx";
import ChatBot from "@modules/beirholm-bi/views/ChatBot.jsx";
import CompetitorAnalysis from "@modules/beirholm-bi/views/CompetitorAnalysis.jsx";

export const BEIRHOLM_BI_ROUTES = {
    FIELD_DEFINITION_READ: {
        path: '/module/field/definitions',
        permission: 'view_beirholm_field_definitions',
    },
    FIELD_DEFINITION_CREATE: {
        path: '/module/field/definitions/add/',
        permission: 'add_beirholm_field_definitions',
    },

    CORRECTION_RULE_READ: {
        path: '/module/correction/rules',
        permission: 'view_beirholm_field_definitions',
    },
    CORRECTION_RULE_CREATE: {
        path: '/module/correction/rules/add/',
        permission: 'add_beirholm_field_definitions',
    },

    DATA_SANITIZATION_READ: {
        path: '/module/data/sanitization',
        permission: 'view_beirholm_field_definitions',
    },

    CHAT_BOT_READ: {
        path: '/module/chat/bot',
        permission: 'view_beirholm_field_definitions',
    },
    COMPETITOR_ANALYSIS: {
        path: '/module/competitor/analysis',
        permission: 'view_beirholm_field_definitions',
    },
};

export const MODULE_ROUTES = [
    {
        path: BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_READ.path,
        component: FieldDefinitionList,
        permission: BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_CREATE.path,
        component: FieldDefinitionForm,
        permission: BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_CREATE.permission,
    },

    {
        path: BEIRHOLM_BI_ROUTES.CORRECTION_RULE_READ.path,
        component: CorrectionRulesList,
        permission: BEIRHOLM_BI_ROUTES.CORRECTION_RULE_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.CORRECTION_RULE_CREATE.path,
        component: CorrectionRulesForm,
        permission: BEIRHOLM_BI_ROUTES.CORRECTION_RULE_CREATE.permission,
    },

    {
        path: BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.path,
        component: DataSanitizationList,
        permission: BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.permission,
    },
     {
        path: BEIRHOLM_BI_ROUTES.CHAT_BOT_READ.path,
        component: ChatBot,
        permission: BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.COMPETITOR_ANALYSIS.path,
        component: CompetitorAnalysis,
        permission: BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.permission,
    },
];

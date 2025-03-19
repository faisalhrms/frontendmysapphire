import FieldDefinitionList from "@modules/beirholm-bi/views/FieldDefinitionList.jsx";
import FieldDefinitionForm from "@modules/beirholm-bi/components/FieldDefinitionForm.jsx";
import CorrectionRulesList from "@modules/beirholm-bi/views/CorrectionRulesList.jsx";
import CorrectionRulesForm from "@modules/beirholm-bi/components/CorrectionRulesForm.jsx";
import DataSanitizationList from "@modules/beirholm-bi/views/DataSanitizationList.jsx";
import ChatBot from "@modules/beirholm-bi/views/ChatBot.jsx";
import CompetitorAnalysis from "@modules/beirholm-bi/views/CompetitorAnalysis.jsx";
import CorrectionPatternsList from "@modules/beirholm-bi/views/CorrectionPatternsList.jsx";
import CorrectionPatternsForm from "@modules/beirholm-bi/components/CorrectionPatternsForm.jsx";
import ExchangeRateList from "@modules/beirholm-bi/views/ExchangeRateList.jsx";
import ExchangeRateForm from "@modules/beirholm-bi/components/ExchangeRateForm.jsx";
import importerClassificationList from "@modules/beirholm-bi/views/ImporterClassificationList.jsx";
import importerClassificationForm from "@modules/beirholm-bi/components/ImporterClassificationForm.jsx";

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
        permission: 'view_beirholm_error_correction_rule',
    },
    CORRECTION_RULE_CREATE: {
        path: '/module/correction/rules/add/',
        permission: 'add_beirholm_error_correction_rule',
    },

    CORRECTION_PATTERN_READ: {
        path: '/module/correction/patterns',
        permission: 'view_error_correction_pattern',
    },
    CORRECTION_PATTERN_CREATE: {
        path: '/module/correction/patterns/add/',
        permission: 'add_error_correction_pattern',
    },

    DATA_SANITIZATION_READ: {
        path: '/module/data/sanitization',
        permission: 'view_data_sanitization',
    },

    CHAT_BOT_READ: {
        path: '/module/chat/bot',
        permission: 'view_chat_bot',
    },
    COMPETITOR_ANALYSIS: {
        path: '/module/competitor/analysis',
        permission: 'view_competitor_analysis',
    },

    EXCHANGE_RATE_READ: {
        path: '/module/exchange/rate',
        permission: 'view_exchange_rate',
    },
   EXCHANGE_RATE_CREATE: {
        path: '/module/exchange/rate/add/',
        permission: 'add_exchange_rate',
    },

    IMPORTER_CLASSIFICATION_READ: {
        path: '/module/classification',
        permission: 'view_importer_classification',
    },
   IMPORTER_CLASSIFICATION_CREATE: {
        path: '/module/classification/add/',
        permission: 'add_importer_classification',
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
        path: BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_READ.path,
        component: CorrectionPatternsList,
        permission: BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_CREATE.path,
        component: CorrectionPatternsForm,
        permission: BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_CREATE.permission,
    },

    {
        path: BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.path,
        component: DataSanitizationList,
        permission: BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.CHAT_BOT_READ.path,
        component: ChatBot,
        permission: BEIRHOLM_BI_ROUTES.CHAT_BOT_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.COMPETITOR_ANALYSIS.path,
        component: CompetitorAnalysis,
        permission: BEIRHOLM_BI_ROUTES.COMPETITOR_ANALYSIS.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_READ.path,
        component: ExchangeRateList,
        permission: BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_CREATE.path,
        component: ExchangeRateForm,
        permission: BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_CREATE.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.IMPORTER_CLASSIFICATION_READ.path,
        component: importerClassificationList,
        permission: BEIRHOLM_BI_ROUTES.IMPORTER_CLASSIFICATION_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.IMPORTER_CLASSIFICATION_CREATE.path,
        component: importerClassificationForm,
        permission: BEIRHOLM_BI_ROUTES.IMPORTER_CLASSIFICATION_CREATE.permission,
    },
];

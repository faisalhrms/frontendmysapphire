import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { createErrorCorrection, getErrorCorrectionById, updateErrorCorrection } from "@modules/beirholm-bi/services/CorrectionRulesService.js";
import { getFieldDefinitionAll } from "@modules/beirholm-bi/services/fieldDefinitionService.js";

export const useErrorCorrectionForm = (id) => {
    const [fieldDefinitions, setFieldDefinitions] = useState([]);
    const [initialData, setInitialData] = useState(null);
    const [selectedFieldDefinition, setSelectedFieldDefinition] = useState(null);
    const { handleSubmit, control, setValue, getValues, formState: { errors, isSubmitting }, watch } = useForm({
        defaultValues: {
            header: "",
            field_definition: "",
            correct_value: "",
            error_value: "",
            child_errors: [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "child_errors",
    });
    const fetchFieldDefinitions = async () => {
        const fd = await getFieldDefinitionAll();
        setFieldDefinitions(fd?.data?.rows || []);
    };
    const loadRule = async () => {
        const res = await getErrorCorrectionById(id);
        setInitialData(res);
    };
    useEffect(() => {
        fetchFieldDefinitions();
        if (id) loadRule();
    }, [id]);
    useEffect(() => {
        if (initialData) {
            setValue("field_definition", initialData.field_definition.id);
            setSelectedFieldDefinition(initialData.field_definition.id);
            setValue("correct_value", initialData.field_definition.correct_value);
            setValue("error_value", initialData.error_value);
            setValue("header", initialData.header || "");
            if (initialData.child_errors) {
                setValue("child_errors", initialData.child_errors.map(c => ({ error_value: c.error_value })));
            }
        }
    }, [initialData, setValue]);
    const onFieldDefinitionChange = (val) => {
        setValue("field_definition", val);
        setSelectedFieldDefinition(val);
        setValue("correct_value", "");
    };
    const onSubmit = async () => {
        const newData = getValues();
        if (id) {
            await updateErrorCorrection(id, newData);
        } else {
            await createErrorCorrection(newData);
        }
    };
    return {
        handleSubmit,
        control,
        errors,
        isSubmitting,
        onSubmit,
        fieldDefinitions,
        fields,
        append,
        remove,
        onFieldDefinitionChange,
        selectedFieldDefinition,
        watch
    };
};

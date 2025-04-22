import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { createErrorCorrection, getErrorCorrectionById, updateErrorCorrection } from "@modules/beirholm-bi/services/CorrectionRulesService.js";
import { getFieldDefinitionAll } from "@modules/beirholm-bi/services/fieldDefinitionService.js";

export const useErrorCorrectionForm = (id) => {
  const [fieldDefinitions, setFieldDefinitions] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [selectedFieldDefinition, setSelectedFieldDefinition] = useState(null);
  const { handleSubmit, control, setValue, getValues, watch, formState: { errors, isSubmitting } } = useForm({
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
      if (initialData.field_definition) {
        setValue("header", initialData.field_definition.header ? initialData.field_definition.header.id : "");
        setValue("field_definition", initialData.field_definition.id);
        setSelectedFieldDefinition(initialData.field_definition.id);
        setValue("correct_value", initialData.sanitized_data ? initialData.sanitized_data.id : "");
      }
      setValue("error_value", initialData.error_value);
      if (initialData.child_errors) {
        setValue("child_errors", initialData.child_errors.map(c => ({ error_value: c.error_value })));
      }
    }
  }, [initialData, setValue]);

  // Always update field_definition when correct_value changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "correct_value" && value.correct_value) {
        setValue("field_definition", value.correct_value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

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
    selectedFieldDefinition,
    initialData,
    watch
  };
};


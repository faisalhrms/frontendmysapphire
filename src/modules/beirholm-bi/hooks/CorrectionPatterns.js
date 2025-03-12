import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { createPattern, getErrorPatternById, updatePattern } from "@modules/beirholm-bi/services/CorrectionPatternsService.js";

export const usePatternForm = (id) => {
  const [initialData, setInitialData] = useState(null);
  const { handleSubmit, control, setValue, getValues, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      header: "",
      pattern: "",
      is_active: true,
      child_patterns: []
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "child_patterns",
  });

  const loadPattern = async () => {
    const res = await getErrorPatternById(id);
    setInitialData(res);
  };

  useEffect(() => {
    if (id) loadPattern();
  }, [id]);

  useEffect(() => {
    if (initialData) {
      if (initialData.header) {
        setValue("header", initialData.header.id);
      }
      setValue("pattern", initialData.pattern || "");
      setValue("is_active", initialData.is_active);
      if (initialData.child_patterns) {
        setValue("child_patterns", initialData.child_patterns.map(c => ({
          pattern: c.pattern
        })));
      }
    }
  }, [initialData, setValue]);

  const onSubmit = async () => {
    const newData = getValues();
    if (id) {
      await updatePattern(id, newData);
    } else {
      await createPattern(newData);
    }
  };

  return {
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit,
    append,
    remove,
    initialData,
    watch
  };
};

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createFieldDefinition, getFieldDefinitionById, updateFieldDefinition } from "@modules/beirholm-bi/services/fieldDefinitionService.js";

export const useFieldDefinition = (id) => {
  const [fieldDefinition, setFieldDefinition] = useState(null);
  const { handleSubmit, control, setValue, getValues, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      id: "",
      correct_value: "",
      header: null
    },
  });

  const fetchFieldDefinition = async (id) => {
    try {
      const res = await getFieldDefinitionById(id);
      setFieldDefinition(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFieldDefinition(id);
    }
  }, [id]);

  useEffect(() => {
    if (fieldDefinition) {
      setValue("id", fieldDefinition.id);
      setValue("header", fieldDefinition.header);
      setValue("correct_value", fieldDefinition.correct_value);
    }
  }, [fieldDefinition, setValue]);

  const onSubmit = async () => {
    try {
      const newData = getValues();
      if (id) {
        await updateFieldDefinition(id, newData);
      } else {
        await createFieldDefinition(newData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { handleSubmit, control, errors, isSubmitting, onSubmit, fieldDefinition };
};

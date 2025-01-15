import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import SunEditor from "suneditor-react";
import ErrorMessage from "@components/form/ErrorMessage.jsx";
const FormRichTextarea = forwardRef(
  ({ name, control, errors, placeholder, editorOptions = {}, readOnly, ...rest }, ref) => {
    return (
      <>
        {placeholder && <label htmlFor={name} className="form-label">{placeholder}</label>}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <SunEditor
              {...field}
              ref={ref}
              readOnly={readOnly}
              setOptions={editorOptions}
              onChange={(content) => field.onChange(content)}
              setContents={field.value || ""}
              {...rest}
            />
          )}
        />
        {errors[name] && <ErrorMessage message={errors[name]?.message} />}
      </>
    );
  }
);

export default FormRichTextarea;

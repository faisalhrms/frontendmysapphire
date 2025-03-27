import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import SunEditor from "suneditor-react";
import ErrorMessage from "@components/form/ErrorMessage.jsx";

const editorStyle = `
.sun-editor .se-toolbar {
  position: sticky !important;
  top: 0 !important;
  z-index: 999;
  background: #fff;
}
`;

const FormRichTextarea = forwardRef(({ name, control, errors, placeholder, editorOptions = {}, readOnly, is_required = false, ...rest }, ref) => {
  return (
    <>
      <style>{editorStyle}</style>
      {placeholder && <label htmlFor={name} className="form-label">{placeholder}{is_required && <span className="text-rose-500 pl-1"> *</span>}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div style={{ maxHeight: 250, overflowY: "auto" }}>
            <SunEditor
              {...field}
              ref={ref}
              readOnly={readOnly}
              setOptions={{
                ...editorOptions,
                defaultStyle: "font-family: Calibri, sans-serif; font-size: 11pt;",
                stickyToolbar: 0
              }}
              onChange={(content) => field.onChange(content)}
              setContents={field.value || ""}
              {...rest}
            />
          </div>
        )}
      />
      {errors[name] && <ErrorMessage message={errors[name]?.message} />}
    </>
  );
});

export default FormRichTextarea;

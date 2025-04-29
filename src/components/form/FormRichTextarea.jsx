import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import SunEditor from "suneditor-react";
import ErrorMessage from "@components/form/ErrorMessage.jsx";

const editorStyle = `
.sun-editor .se-toolbar { position: static !important; }
.sun-editor .se-container, .sun-editor .se-wrapper { overflow: visible !important; }
.sun-editor .se-list-layer { overflow: visible !important; z-index: 1000 !important; }
`;

const FormRichTextarea = forwardRef(({ name, control, errors, placeholder, editorOptions = {}, readOnly, is_required = false, ...rest }, ref) => (
  <>
    <style>{editorStyle}</style>
    {placeholder && <label htmlFor={name} className="form-label">{placeholder}{is_required && <span className="text-rose-500 pl-1">*</span>}</label>}
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SunEditor
          {...field}
          ref={ref}
          readOnly={readOnly}
          setOptions={{
            ...editorOptions,
            defaultStyle: "font-family:Calibri,sans-serif;font-size:11pt;",
            stickyToolbar: false,
            mode: "classic",
            popupDisplay: "bottom"
          }}
          onChange={field.onChange}
          setContents={field.value || ""}
          {...rest}
        />
      )}
    />
    {errors[name] && <ErrorMessage message={errors[name]?.message} />}
  </>
));

export default FormRichTextarea;

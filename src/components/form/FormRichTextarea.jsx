import React, { forwardRef, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import SunEditor from "suneditor-react";
import ErrorMessage from "@components/form/ErrorMessage.jsx";

const FormRichTextArea = forwardRef(({ name, control, errors, placeholder, editorOptions = {}, readOnly, ...rest }, ref) => {
    const editorRef = useRef();

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.editor.core.context.element.wysiwyg.innerHTML = "";
        }
    }, [rest.defaultValue]);

    return (
        <>
            <label htmlFor={name} className="form-label">{placeholder}</label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <SunEditor
                        {...field}
                        ref={(node) => {
                            ref && (ref.current = node);
                            editorRef.current = node;
                        }}
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
});

export default FormRichTextArea;

import React, { forwardRef } from 'react';
import { Controller } from 'react-hook-form';
import SunEditor from "suneditor-react";
import ErrorMessage from '@components/form/ErrorMessage.jsx';

const FormRichTextArea = forwardRef(({ name, control, errors, placeholder, editorOptions = {}, readOnly, ...rest }, ref) => (
    <>
        <label htmlFor={name} className="form-label">{placeholder}</label>
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
                    defaultValue={field.value || ""}
                    {...rest}
                />
            )}
        />
        {errors[name] && <ErrorMessage message={errors[name]?.message} />}
    </>
));

export default FormRichTextArea;

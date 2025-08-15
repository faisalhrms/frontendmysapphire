import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import SunEditor from "suneditor-react";
import ErrorMessage from "@components/form/ErrorMessage.jsx";


const FormRichTextarea = forwardRef(({ name, control, errors, placeholder, editorOptions = {}, readOnly, is_required = false, ...rest }, ref) => {
    const fieldError = name
        .split(/[\.\[\]]+/)
        .filter(Boolean)
        .reduce((acc, key) => (acc && acc[key] ? acc[key] : null), errors);

    return (
        <>
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
                            defaultStyle: "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.5; color: #334155;",
                            stickyToolbar: false,
                            mode: "classic",
                            resizingBar: false,
                            showPathLabel: false,
                            charCounter: true,
                            charCounterLabel: 'Characters: ',
                            maxCharCount: 5000,
                            toolbarContainer: null,
                            buttonList: editorOptions.buttonList || [
                                ['undo', 'redo'],
                                ['bold', 'italic', 'underline', 'strike'],
                                ['fontColor', 'hiliteColor'],
                                ['removeFormat'],
                                ['outdent', 'indent'],
                                ['align', 'horizontalRule', 'list', 'lineHeight'],
                                ['table', 'link'],
                            ],
                            toolbarWidth: 'auto',
                            toolbarStickyOffset: 0,
                            placeholder: rest.placeholder || 'Start typing...',
                            formats: [
                                'bold', 'italic', 'underline', 'strike',
                                'fontColor', 'hiliteColor',
                                'align', 'list', 'lineHeight',
                                'table', 'link', 'horizontalRule'
                            ],
                            font: [
                                'Inter',
                                'Arial',
                                'Helvetica',
                                'sans-serif',
                                'serif',
                                'monospace'
                            ],
                            fontSize: [
                                8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36
                            ],
                            colorList: [
                                ['#000000', '#434343', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff'],
                                ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'],
                                ['#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'],
                                ['#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
                                ['#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'],
                                ['#1155cc', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'],
                                ['#0d47a1', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47']
                            ],
                            ...editorOptions
                        }}
                        onChange={field.onChange}
                        setContents={field.value || ""}
                        {...rest}
                    />
                )}
            />
            <ErrorMessage message={fieldError?.message} />
        </>
    )
});

export default FormRichTextarea;

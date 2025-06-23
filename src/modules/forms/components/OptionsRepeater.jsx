import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

const OptionsRepeater = ({ fieldIndex, control, setValue, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `fields.${fieldIndex}.options`,
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({ label: '', value: '' });
        }
    }, [fields, append]);

    return (
        <div className="col-span-12">
            <label className="block text-sm font-medium mb-2 ml-4 mt-4">Options</label>
            {fields.map((option, optionIndex) => (
                <div key={option.id} className="grid grid-cols-12 gap-2  ml-4 mt-4 mb-4">
                    <div className="col-span-5">
                        <input
                            className="form-control form-control-sm border-dotted"
                            placeholder="Label"
                            {...control.register(`fields.${fieldIndex}.options.${optionIndex}.label`)}
                        />
                        {errors?.fields?.[fieldIndex]?.options?.[optionIndex]?.label && (
                            <span className="text-red text-xs">{errors.fields[fieldIndex].options[optionIndex].label.message}</span>
                        )}
                    </div>
                    <div className="col-span-5">
                        <input
                            className="form-control form-control-sm border-dotted"
                            placeholder="Value"
                            {...control.register(`fields.${fieldIndex}.options.${optionIndex}.value`)}
                        />
                        {errors?.fields?.[fieldIndex]?.options?.[optionIndex]?.value && (
                            <span className="text-red text-xs">{errors.fields[fieldIndex].options[optionIndex].value.message}</span>
                        )}
                    </div>
                    <div className="col-span-2 flex items-center ml-4">
                        <button
                            type="button"
                            onClick={() => append({label: '', value: ''})}
                            className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem] mr-2"
                        >
                            <i className="bi bi-plus-circle-fill"></i>
                        </button>
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(optionIndex)}
                                className="ti-btn ti-btn-outline-danger !py-1 !px-2 !text-[0.75rem]"
                            >
                                <i className="bi bi-trash3-fill"></i>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OptionsRepeater;
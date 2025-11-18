import React, { useRef, useCallback, useMemo, useState } from 'react';
import FormInput from '@components/form/FormInput.jsx';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import { PlusCircle, MinusCircle, GripVertical } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = 'APPROVER_ROW';

const ApproverRow = ({
                         field,
                         index,
                         control,
                         errors,
                         setValue,
                         onRemove,
                         onAdd,
                         moveItem,
                         fieldsLength,
                         allowParallelApprovers = false,
                     }) => {
    const ref = useRef(null);

    // watch only this approver
    const approver = useWatch({ control, name: `approvers.${index}` });
    const option = approver?.approverOption;

    // CRITICAL FIX: Track the immediate selection to prevent reset
    const [immediateSelection, setImmediateSelection] = useState(null);

    // FIXED: Use immediate selection if available, otherwise use watched option
    const currentOption = immediateSelection || option;

    // Ensure we always have a valid preselected options array
    const pre = useMemo(() => {
        if (!currentOption) return [];
        // Make sure the option has both value and label
        if (currentOption && typeof currentOption === 'object' && currentOption.value && currentOption.label) {
            return [currentOption];
        }
        return [];
    }, [currentOption]);

    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE,
        item: { index, id: field?.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: ITEM_TYPE,
        hover: (dragged, monitor) => {
            if (!ref.current) return;
            const fromIndex = dragged.index;
            const toIndex = index;
            if (fromIndex === toIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // dragging downwards
            if (fromIndex < toIndex && hoverClientY < hoverMiddleY) return;
            // dragging upwards
            if (fromIndex > toIndex && hoverClientY > hoverMiddleY) return;

            moveItem(fromIndex, toIndex);
            dragged.index = toIndex;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    drag(drop(ref));

    const handleAdd = useCallback(() => {
        onAdd();
    }, [onAdd]);

    const handleRemove = useCallback(() => {
        onRemove(index);
    }, [onRemove, index]);

    // FIXED: Use onOptionChange instead of onChange + handle immediate selection
    const handleSelectChange = useCallback((selected) => {
        setImmediateSelection(selected);

        if (typeof setValue === 'function') {
            if (selected) {
                // When a valid selection is made
                setValue(`approvers.${index}.approver_id`, selected.value, {
                    shouldValidate: true,
                    shouldDirty: true
                });
                setValue(`approvers.${index}.approverOption`, selected, {
                    shouldValidate: false,
                    shouldDirty: true
                });
            } else {
                // When selection is cleared
                setValue(`approvers.${index}.approver_id`, null, {
                    shouldValidate: true,
                    shouldDirty: true
                });
                setValue(`approvers.${index}.approverOption`, null, {
                    shouldValidate: false,
                    shouldDirty: true
                });
            }

            // Clear immediate selection after a short delay to let useWatch catch up
            setTimeout(() => {
                setImmediateSelection(null);
            }, 100);
        }
    }, [index, setValue]);

    const levelValue = approver?.level ?? index + 1;

    return (
        <div
            ref={ref}
            className={`
                grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-all duration-200 relative
                ${isDragging ? 'opacity-50 scale-95 z-0' : 'opacity-100 scale-100 z-10'}
                ${isOver ? 'bg-sky-50 dark:bg-blue-900/20 border-sky-300 z-20' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}
                hover:shadow-sm hover:z-30
            `}
            style={{
                zIndex: isDragging ? 0 : isOver ? 20 : 10
            }}
        >
            {/* Drag Handle */}
            <div className="col-span-1 flex justify-center items-center">
                <div className="flex flex-row items-center gap-2 cursor-grab hover:text-gray-600 active:cursor-grabbing">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {allowParallelApprovers ? levelValue : index + 1}
                    </div>
                    <GripVertical className="w-4 h-4 text-gray-400"/>
                </div>
            </div>

                <div className={allowParallelApprovers ? "col-span-2" : "hidden"}>
                  {allowParallelApprovers && (
                    <FormInput
                      type="number"
                      name={`approvers.${index}.level`}
                      control={control}
                      errors={errors}
                      placeholder="Level"
                      label={false}
                    />
                  )}
                </div>

                <div
                  className={`${allowParallelApprovers ? "col-span-8" : "col-span-10"} relative z-50`}
                >
                  <FormAsyncSelect
                    key={`approver-${field?.id || index}-${approver?.approver_id || "empty"}`}
                    name={`approvers.${index}.approver_id`}
                    control={control}
                    errors={errors}
                    placeholder={`Select Approver ${index + 1}`}
                    label={false}
                    apiUrl="/select/users/"
                    queryKeyBase="users"
                    preselectedOptions={pre}
                    onOptionChange={handleSelectChange}
                    isClearable={true}
                  />
                </div>


            {/* Action Buttons */}
            <div className="col-span-1 flex flex-col gap-1 items-center">
                <PlusCircle
                    size={20}
                    className="cursor-pointer text-emerald-500 hover:text-emerald-600 transition-colors"
                    onClick={handleAdd}
                    title="Add approver"
                />
                {fieldsLength > 1 && (
                    <MinusCircle
                        size={20}
                        className="cursor-pointer text-rose-500 hover:text-rose-600 transition-colors"
                        onClick={handleRemove}
                        title="Remove approver"
                    />
                )}
            </div>
        </div>
    );
};

export default React.memo(ApproverRow);
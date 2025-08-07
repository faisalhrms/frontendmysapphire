import React, { useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import { PlusCircle, MinusCircle, GripVertical } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = 'APPROVER_ROW';

const ApproverRow = ({
                         index,
                         control,
                         errors,
                         onRemove,
                         onAdd,
                         moveItem,
                         fieldsLength
                     }) => {
    const ref = useRef(null);
    const user = useSelector((state) => state.auth.user);
    const company_id = user?.employee?.company?.id;

    // Watch specific approver to avoid unnecessary re-renders
    const approver = useWatch({ control, name: `approvers.${index}` });
    const option = approver?.approverOption;

    // Memoize preselected options
    const pre = useMemo(() => (option ? [option] : []), [option]);

    // Memoize API URL
    const apiUrl = useMemo(() => `/select/users/?company_id=${company_id}`, [company_id]);
    const queryKeyBase = useMemo(() => `company_${company_id}_users`, [company_id]);

    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: ITEM_TYPE,
        hover: (dragged) => {
            const fromIndex = dragged.index;
            const toIndex = index;
            if (fromIndex !== toIndex) {
                moveItem(fromIndex, toIndex);
                dragged.index = toIndex;
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    // Combine drag and drop refs
    drag(drop(ref));

    // Memoize handlers
    const handleAdd = useCallback(() => {
        onAdd();
    }, [onAdd]);

    const handleRemove = useCallback(() => {
        onRemove(index);
    }, [onRemove, index]);

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
                <div className="flex flex-row items-center gap-2 cursor-grab hover:text-gray-600 active:cursor-grabbing"
                     title="Drag to reorder">
                    <div
                        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                    </div>
                    <GripVertical className="w-4 h-4 text-gray-400"/>
                </div>
            </div>

            {/* Approver Select */}
            <div className="col-span-10 relative z-50">
                <FormAsyncSelect
                    name={`approvers.${index}.approver_id`}
                    control={control}
                    errors={errors}
                    placeholder={`Select Approver ${index + 1}`}
                    label={false}
                    apiUrl={apiUrl}
                    queryKeyBase={queryKeyBase}
                    preselectedOptions={pre}
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

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ApproverRow);
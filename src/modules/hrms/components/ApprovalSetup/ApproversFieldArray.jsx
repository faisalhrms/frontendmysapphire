import React, { useMemo, useCallback } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ApproverRow from '@modules/hrms/components/ApprovalSetup/ApproverRow.jsx';

const ApproversFieldArray = ({ control, errors, setValue, allowParallelApprovers = false }) => {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'approvers',
    });

    const approvers = useWatch({ control, name: 'approvers' }) || [];

    const memoizedFields = useMemo(() => fields, [fields]);

    const handleMoveItem = useCallback(
        (fromIndex, toIndex) => {
            if (fromIndex === toIndex) return;
            move(fromIndex, toIndex);
        },
        [move]
    );

    const handleAddApprover = useCallback(() => {
        const last = approvers[approvers.length - 1];
        const nextLevel = allowParallelApprovers ? (last?.level || 1) : approvers.length + 1;
        append({
            level: nextLevel,
            approver_id: null,
            approverOption: null,
        });
    }, [append, approvers, allowParallelApprovers]);

    const handleRemoveApprover = useCallback(
        (index) => {
            remove(index);
        },
        [remove]
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-4 mt-4 relative">
                {memoizedFields.map((field, index) => (
                    <div
                        key={field.id}
                        className="relative"
                        style={{ zIndex: memoizedFields.length - index }}
                    >
                        <ApproverRow
                            field={field}                 // pass the field so child can use stable id
                            index={index}
                            control={control}
                            errors={errors}
                            setValue={setValue}           // pass setValue
                            onRemove={handleRemoveApprover}
                            onAdd={handleAddApprover}
                            moveItem={handleMoveItem}
                            fieldsLength={memoizedFields.length}
                            allowParallelApprovers={allowParallelApprovers}
                        />
                    </div>
                ))}
                {memoizedFields.length === 0 && (
                    <div className="text-center py-4">
                        <button
                            type="button"
                            onClick={handleAddApprover}
                            className="ti-btn ti-btn-primary-full !py-2 !px-4"
                        >
                            <i className="ri-add-line font-semibold align-middle me-1"></i>
                            Add First Approver
                        </button>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};

export default React.memo(ApproversFieldArray);

import React, { useMemo, useCallback } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ApproverRow from '@modules/hrms/components/ApprovalSetup/ApproverRow.jsx';

const ApproversFieldArray = ({
                                 control,
                                 errors,
                                 moveApprover,
                                 addApprover,
                                 removeApprover
                             }) => {
    const { fields } = useFieldArray({
        control,
        name: 'approvers',
    });

    const approvers = useWatch({ control, name: 'approvers' }) || [];

    // Memoize fields to prevent unnecessary re-renders
    const memoizedFields = useMemo(() => fields, [fields]);

    // Memoize handlers to prevent child re-renders
    const handleMoveItem = useCallback(
        (fromIndex, toIndex) => {
            if (fromIndex === toIndex) return;
            moveApprover(fromIndex, toIndex);
        },
        [moveApprover]
    );

    const handleAddApprover = useCallback(() => {
        addApprover(approvers.length);
    }, [addApprover, approvers.length]);

    const handleRemoveApprover = useCallback((index) => {
        removeApprover(index);
    }, [removeApprover]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-4 mt-4 relative">
                {memoizedFields.map((field, index) => (
                    <div key={field.id} className="relative" style={{ zIndex: memoizedFields.length - index }}>
                        <ApproverRow
                            index={index}
                            control={control}
                            errors={errors}
                            onRemove={handleRemoveApprover}
                            onAdd={handleAddApprover}
                            moveItem={handleMoveItem}
                            fieldsLength={memoizedFields.length}
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
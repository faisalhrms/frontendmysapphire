import React, { useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import ApproverRow from '@modules/hrms/components/ApprovalSetup/ApproverRow.jsx';

const ApproversFieldArray = ({ control, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'approvers',
    });

    const memoizedFields = useMemo(() => fields, [fields]);

    return (
        <div className="space-y-4 mt-4">
            {memoizedFields.map((field, index) => (
                <ApproverRow
                    key={field.id}
                    index={index}
                    control={control}
                    errors={errors}
                    remove={remove}
                    append={append}
                    fieldsLength={memoizedFields.length}
                />
            ))}
        </div>
    );
};

export default ApproversFieldArray;
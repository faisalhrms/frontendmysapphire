import React, { useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import ProjectMemberRow from "./ProjectMemberRow";

const ProjectMembers = ({ data, control, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "members",
    });
    const memoizedFields = useMemo(() => fields, [fields]);

    return (
        <div className="col-span-12">
            <div className="space-y-4">
                {memoizedFields.map((field, index) => (
                    <ProjectMemberRow
                        key={field.id}
                        index={index}
                        control={control}
                        errors={errors}
                        remove={remove}
                        append={append}
                        data={data}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectMembers;
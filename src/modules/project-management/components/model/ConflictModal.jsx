import {getStatusClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import conflictSchema from "@modules/project-management/schemas/conflictSchema.js";
import React, {useEffect} from "react";
import {useConflictForm} from "@modules/project-management/hooks/conflictHooks.js";
import FormInput from "@components/form/FormInput.jsx";
import HiddenFormInput from "@components/form/HiddenFormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";

const ConflictModal = ({ conflicts, heading = 'Conflicts', closeModal }) => {
    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
        resolver: zodResolver(conflictSchema),
        defaultValues: {
            ...conflicts
        }
    });
    const { handleConflictSubmit } = useConflictForm('pms/projects/conflicts/', closeModal);
    useEffect(() => {
        if (conflicts) {
            Object.keys(conflicts).forEach(key => {
                setValue(key, conflicts[key]);
            });
        }
    }, [conflicts, setValue]);
    return (
        <>
            <form onSubmit={handleSubmit(handleConflictSubmit)}>
                <div
                    id="conflictModal"
                    data-hs-overlay-keyboard="false"
                    className="hs-overlay ti-modal hidden [--overlay-backdrop:static] h-screen w-screen">
                    <div className="hs-overlay-open:mt-0 ti-modal-box mt-10 !m-0 !max-w-full !w-full !h-full">
                        <div className="ti-modal-content !rounded-none">
                            <div className="ti-modal-header">
                                <h6 className="modal-title" id="staticBackdropLabel">

                                </h6>
                                <button type="button" className="hs-dropdown-toggle ti-modal-close-btn"
                                        onClick={closeModal}>
                                    <span className="sr-only">Close</span>
                                    <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="ti-modal-body overflow-y-auto max-h-[calc(100vh-200px)]">
                                {
                                    conflicts?.project &&
                                    (
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title"> Project</div>
                                            </div>
                                            <div className="box-body">
                                                <div className="table-responsive">
                                                    <table className="table whitespace-nowrap min-w-full">
                                                        <thead className="bg-primary/10">
                                                        <tr className="border-b border-primary/10">
                                                            <th scope="col" className="text-start">Project No</th>
                                                            <th scope="col" className="text-start">Title</th>
                                                            <th scope="col" className="text-start">Status</th>
                                                            <th scope="col" className="text-start">Started Date</th>
                                                            <th scope="col" className="text-start">Ended Date</th>
                                                            <th scope="col" className="text-start">Reason</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                                 (
                                                                    <tr className="border-b border-primary/10">
                                                                        <td>{conflicts.project.project_no}</td>
                                                                        <td>{conflicts.project.name}</td>
                                                                        <td><p
                                                                            className={getStatusClasses(conflicts.project.status)}>{toTitleCase(conflicts.project.status)}</p>
                                                                        </td>
                                                                        <td>
                                                                            <HiddenFormInput
                                                                                name={`project.id`}
                                                                                control={control} errors={errors}
                                                                                value={conflicts.project.id}
                                                                                valueType="number"/>
                                                                            <FormInput
                                                                                type="date"
                                                                                label={false}
                                                                                name={`project.started_at`}
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="Start Date"
                                                                                readOnly={true}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <FormInput
                                                                                type="date"
                                                                                label={false}
                                                                                name={`project.ended_at`}
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="Ended Date"
                                                                                readOnly={true}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <FormInput
                                                                                label={false}
                                                                                name={`project.reason`}
                                                                                control={control}
                                                                                errors={errors}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                    }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    conflicts?.milestones?.length > 0 &&
                                    (
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title"> Conflicts in Milestones</div>
                                            </div>
                                            <div className="box-body">
                                                <div className="table-responsive">
                                                    <table className="table whitespace-nowrap min-w-full">
                                                        <thead className="bg-primary/10">
                                                        <tr className="border-b border-primary/10">
                                                            <th scope="col" className="text-start">Milestone</th>
                                                            <th scope="col" className="text-start">Status</th>
                                                            <th scope="col" className="text-start">Started Date</th>
                                                            <th scope="col" className="text-start">Ended Date</th>
                                                            <th scope="col" className="text-start">Reason</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            conflicts.milestones.length > 0 &&
                                                            conflicts.milestones.map((milestone, index) => {
                                                                return (
                                                                    <tr className="border-b border-primary/10"
                                                                        key={index}>
                                                                        <td>{milestone.name}</td>
                                                                        <td><p
                                                                            className={getStatusClasses(milestone.status)}>{toTitleCase(milestone.status)}</p>
                                                                        </td>
                                                                        <td>
                                                                            <HiddenFormInput
                                                                                name={`milestones.${index}.id`}
                                                                                control={control} errors={errors}
                                                                                value={milestone.id}
                                                                                valueType="number"/>
                                                                            <FormInput
                                                                                type="date"
                                                                                label={false}
                                                                                name={`milestones.${index}.started_at`}
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="Start Date"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <FormInput
                                                                                type="date"
                                                                                label={false}
                                                                                name={`milestones.${index}.ended_at`}
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="Ended Date"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <FormInput
                                                                                label={false}
                                                                                name={`milestones.${index}.reason`}
                                                                                control={control}
                                                                                errors={errors}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    conflicts?.tasks?.length > 0 &&
                                    (
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title"> Conflicts in Tasks</div>
                                            </div>
                                            <div className="box-body">
                                                <div className="table-responsive">
                                                    <table className="table whitespace-nowrap min-w-full">
                                                        <thead className="bg-primary/10">
                                                        <tr className="border-b border-primary/10">
                                                            <th scope="col" className="text-start">Task No</th>
                                                            <th scope="col" className="text-start">Status</th>
                                                            <th scope="col" className="text-start">Title</th>
                                                            <th scope="col" className="text-start">Started Date</th>
                                                            <th scope="col" className="text-start">Ended Date</th>
                                                            <th scope="col" className="text-start">Reason</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            conflicts.tasks.length > 0 &&
                                                            conflicts.tasks.map((task, index) => {
                                                                return (
                                                                    <tr className="border-b border-primary/10"
                                                                        key={index}>
                                                                        <td>{task.task_no}</td>
                                                                        <td><p
                                                                            className={getStatusClasses(task.status)}>{toTitleCase(task.status)}</p>
                                                                        </td>
                                                                        <td>{task.name}</td>
                                                                        <td>
                                                                            <HiddenFormInput name={`tasks.${index}.id`}
                                                                                             control={control}
                                                                                             errors={errors}
                                                                                             value={task.id}
                                                                                             valueType="number"/>
                                                                            <FormInput
                                                                                label={false}
                                                                                type="datetime-local"
                                                                                name={`tasks.${index}.started_at`}
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="Started Date"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <FormInput
                                                                                label={false}
                                                                                type="datetime-local"
                                                                                name={`tasks.${index}.ended_at`}
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="End Date"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <FormInput
                                                                                label={false}
                                                                                name={`tasks.${index}.reason`}
                                                                                control={control}
                                                                                errors={errors}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="ti-modal-footer">
                                <FormButton isLoading={isSubmitting}/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ConflictModal;

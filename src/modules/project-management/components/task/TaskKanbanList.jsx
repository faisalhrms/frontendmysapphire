// TaskKanbanList.jsx
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TaskKanbanCard from '@modules/project-management/components/task/TaskKanbanCard.jsx';
import mediaSvg from '@assets/images/media/media-83.svg';
import { toTitleCase } from '@helpers/formatters.js';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import FormButton from "@components/form/FormButton.jsx";

const TaskKanbanList = ({ status, tasks, loadMore, totalCount, refetch, isLoading, hasMoreTasks }) => {
    return (
        <div className={`kanban-tasks-type ${status} min-w-[320px]`}>
            <div className="mb-4 sticky top-0 z-10">
                <div className="flex justify-between items-center p-2">
                    <span className="block font-semibold text-[.9375rem]">
                        {toTitleCase(status)} - {totalCount}
                    </span>
                </div>
            </div>

            <div className="kanban-tasks">
                <PerfectScrollbar style={{ height: '560px' }}>
                    <div>
                        {tasks.length > 0 ? (
                            <>
                                {tasks.map((task) => (
                                    <TaskKanbanCard key={task.id} task={task} refetch={refetch} />
                                ))}
                            </>
                        ) : (
                            <div className="text-center text-sm text-gray-500 bg-white rounded-md dark:text-white/50">
                                <img src={mediaSvg} alt="No tasks available" className="mx-auto" />
                            </div>
                        )}
                    </div>
                </PerfectScrollbar>
            </div>

            {hasMoreTasks && (
                <div className="m-4 text-center">
                    <FormButton
                        isLoading={isLoading}
                        text="View More"
                        submitTxt="Loading..."
                        onClick={() => loadMore(status)}
                    />
                </div>
            )}
        </div>
    );
};

export default TaskKanbanList;

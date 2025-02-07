import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TaskKanbanCard from '@modules/project-management/components/task/TaskKanbanCard.jsx';
import mediaSvg from '@assets/images/media/media-83.svg';

const TaskKanbanList = ({ statusKey, statusLabel, tasks, loadMore, loadingStatus, totalCount }) => {

    return (
        <div className={`kanban-tasks-type ${statusKey} min-w-[320px]`} key={statusKey}>
            <div className="mb-4 sticky top-0  z-10">
                <div className="flex justify-between items-center p-2">
                    <span className="block font-semibold text-[.9375rem]">
                        {statusLabel} - {totalCount}
                    </span>
                </div>
            </div>

            <div className="kanban-tasks">
                <PerfectScrollbar style={{ height: '560px' }}>
                    <div>
                        {tasks.length > 0 ? (
                            <>
                                {tasks.map((task) => (
                                    <TaskKanbanCard key={task.id} task={task} />
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

            {tasks.length < totalCount && (
                <div className="m-4 text-center">
                    <button
                        className="ti-btn ti-btn-primary"
                        onClick={() => loadMore(statusKey)}
                        disabled={loadingStatus === statusKey}
                    >
                        {loadingStatus === statusKey ? 'Loading...' : 'View More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskKanbanList;

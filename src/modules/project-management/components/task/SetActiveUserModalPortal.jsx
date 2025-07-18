import ReactDOM from 'react-dom';
import SetActiveUserModal from "@modules/project-management/components/task/SetActiveUserModal.jsx";
import React from "react";

const SetActiveUserModalPortal = ({ isOpen, onClose, task, currentActiveUserIds, onUpdate }) => {
    return ReactDOM.createPortal(
        <SetActiveUserModal
            isOpen={isOpen}
            onClose={onClose}
            taskId={task.id}
            taskName={task.name}
            users={task.users || []}
            currentActiveUserIds={currentActiveUserIds()}
            onUpdate={onUpdate}
        />,
        document.getElementById('modal-root')
    );
};

export default SetActiveUserModalPortal
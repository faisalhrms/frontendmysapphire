import ReactDOM from 'react-dom';
import TaskDetailModal from "@modules/project-management/components/model/TaskDetailModal.jsx";

const TaskDetailModalPortal = ({ task, isLoading, closeModal }) => {
    return ReactDOM.createPortal(
        <TaskDetailModal task={task} isLoading={isLoading} closeModal={closeModal} />,
        document.getElementById('modal-root')
    );
};

export default TaskDetailModalPortal
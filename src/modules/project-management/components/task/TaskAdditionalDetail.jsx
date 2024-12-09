import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";

const   TaskAdditionalDetail = ({task}) => {
  return (
    <>
    <div className="box">
        <div className="box-header">
            <div className="box-title">
                Additional Details
            </div>
        </div>
        <div className="box-body !p-0">
            <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                    <tbody>
                    <tr className="border-b border-defaultborder">
                        <td><span className="font-semibold">ID :</span></td>
                        <td>{task.task_no}</td>
                    </tr>
                    <tr className="border-b border-defaultborder">
                        <td><span className="font-semibold">Tags :</span></td>
                        <td className='space-x-1 rtl:space-x-reverse'>
                            {(
                                task?.tags?.map(tag => (
                                    <span key={tag.id} className="badge bg-primary/10 text-primary">{ toTitleCase(tag.name) }</span>
                                ))
                            )}
                        </td>
                    </tr>
                    <tr className="border-b border-defaultborder">
                        <td><span className="font-semibold">Status :</span></td>
                        <td>
                            <span className={getStatusClasses(task.status)}>{toTitleCase(task.status)}</span>
                        </td>
                    </tr>
                    <tr className="border-b border-defaultborder">
                        <td><span className="font-semibold">Priority :</span></td>
                        <td>
                            <span className={getBadgeClasses(task.priority)}>{toTitleCase(task.priority)}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</>  )
}

export default TaskAdditionalDetail
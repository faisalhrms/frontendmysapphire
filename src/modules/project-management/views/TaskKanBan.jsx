import { Fragment, useEffect, useState } from 'react';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

// Dummy data (replace with actual data from API response)
const kanbanData = {
    "data": {
        "in_progress": {
            "tasks": [
                {
                    "id": 2,
                    "task_no": "TSK-25020002",
                    "name": "SalesForce Integration",
                    "description": "DescriptionDescriptionDescription",
                    "status": "in_progress",
                    "priority": "medium",
                    "started_at": "2025-02-13T11:55:00+05:00",
                    "users": [
                        { "full_name": "Rehab Zafar", "avatar": null }
                    ],
                    "tags": [{ "name": "Sr" }],
                    "teams": [{ "name": "BACK END APEX DEV" }],
                    "progress": 25,
                    "days_left": 17
                },
                {
                    "id": 3,
                    "task_no": "TSK-25020003",
                    "name": "Sales Force OMS",
                    "description": "DescriptionDescription",
                    "status": "in_progress",
                    "priority": "medium",
                    "started_at": "2025-02-13T11:58:00+05:00",
                    "users": [
                        { "full_name": "Rehab Zafar", "avatar": null }
                    ],
                    "tags": [{ "name": "Bh, Pd, Rnd" }],
                    "teams": [{ "name": "STORE FRONT" }],
                    "progress": 25,
                    "days_left": 15
                }
            ]
        }
    }
};

const TaskKanBan = () => {
    const [tasksData, setTasksData] = useState(kanbanData.data);

    const getTaskCard = (task) => {
        return (
            <div className="box kanban-tasks">
                <div className="box-body !p-0">
                    <div className="p-4 kanban-board-head">
                        <div className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                            <div><i className="ri-time-line align-middle"></i> Created - {new Date(task.started_at).toLocaleDateString()}</div>
                            <div>{task.days_left} days left</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="task-badges">
                                <span className="badge bg-light text-default">{task.task_no}</span>
                                <span className="ms-1 badge bg-primary/10 text-primary">{task.tags.map(tag => tag.name).join(", ")}</span>
                            </div>
                            <div className="hs-dropdown ti-dropdown ltr:[--placement:bottom-right] rtl:[--placement:bottom-left]">
                                <Link aria-label="anchor" to="#" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-light" aria-expanded="false">
                                    <i className="fe fe-more-vertical"></i>
                                </Link>
                                <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                    <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex" to="#"><i className="ri-eye-line me-1 align-middle"></i>View</Link></li>
                                    <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex" to="#"><i className="ri-delete-bin-line me-1 align-middle"></i>Delete</Link></li>
                                    <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex" to="#"><i className="ri-edit-line me-1 align-middle"></i>Edit</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="kanban-content !mt-1">
                            <h6 className="font-semibold mb-1 text-[.9375rem]">{task.name}</h6>
                            <div className="kanban-task-description">{task.description}</div>
                        </div>
                    </div>
                    <div className="p-4 border-t dark:border-defaultborder/10 border-dashed">
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center">
                                <Link to="#" className="inline-flex items-center me-2 text-primary">
                                    <span className="me-1"><i className="ri-thumb-up-fill align-middle font-normal"></i></span><span className="font-semibold text-[.75rem]">12</span>
                                </Link>
                                <Link to="#" className="inline-flex items-center text-[#8c9097] dark:text-white/50">
                                    <span className="me-1"><i className="ri-message-2-line align-middle font-normal"></i></span><span className="font-semibold text-[.75rem]">02</span>
                                </Link>
                            </div>
                            <div className="avatar-list-stacked">
                                {task.users.map(user => (
                                    <span className="avatar avatar-sm avatar-rounded" key={user.id}>
                    <img src={user.avatar || 'default-avatar.jpg'} alt="img" />
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <PageHeader currentpage="Kanban Board" activepage="Task" mainpage="Kanban Board" />
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-body p-4">
                            <div className="md:flex items-center justify-between flex-wrap gap-4">
                                <div className="grid grid-cols-12 gap-2 md:w-[30%]">
                                    <div className="xl:col-span-5 col-span-12">
                                        <Link to="#" className="hs-dropdown-toggle  ti-btn bg-primary text-white !font-medium " data-hs-overlay="#add-board"><i className="ri-add-line !text-[1rem]"></i>New Board</Link>
                                    </div>
                                    <div className="xl:col-span-7 col-span-12">
                                        <Select name="colors" options={[]} className="w-full !rounded-md" menuPlacement='auto' classNamePrefix="Select2" />
                                    </div>
                                </div>
                                <div className="flex" role="search">
                                    <input className="form-control w-full !rounded-sm me-2" type="search" placeholder="Search" aria-label="Search" />
                                    <button className="ti-btn ti-btn-light !mb-0" type="submit">Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ynex-kanban-board text-defaulttextcolor dark:text-defaulttextcolor/70 text-defaultsize">
                <div className="kanban-tasks-type in-progress">
                    <div className="mb-4">
                        <div className="flex justify-between items-center">
                            <span className="block font-semibold text-[.9375rem]">ON GOING - {tasksData.in_progress.task_count}</span>
                            <div>
                                <Link to="#" className="hs-dropdown-toggle ti-btn !py-1 !px-2 !font-medium !text-[0.75rem] bg-white dark:bg-bodybg text-default border-0" data-hs-overlay="#add-task"><i className="ri-add-line"></i>Add Task</Link>
                            </div>
                        </div>
                    </div>
                    <div className="kanban-tasks">
                        <PerfectScrollbar style={{ height: "560px" }}>
                            {tasksData.in_progress.tasks.map(task => getTaskCard(task))}
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default TaskKanBan;

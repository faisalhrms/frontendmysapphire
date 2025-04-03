import React from 'react';
import { useNavigate } from "react-router-dom";

const SubTaskList = ({ serviceRequest }) => {
    const navigate = useNavigate();

    const onViewTask = (id) => {
        navigate(`/module/ess/service-request/detail/${id}`);
    };

    return (
        <div className={`table-responsive task-table`}>
            <table className="table whitespace-nowrap table-bordered min-w-full">
                <thead className="table-active">
                <tr className="border-b border-defaultborder">
                    <th scope="col" className="text-center !text-xs">SR #</th>
                    <th scope="col" className="text-center !text-xs">Status</th>
                    <th scope="col" className="text-center !text-xs">Created At</th>
                    <th scope="col" className="text-center !text-xs">Actions</th>
                </tr>
                </thead>
                <tbody>
                {serviceRequest.length > 0 ? (
                    serviceRequest.map((childRequest) => (
                        <React.Fragment key={childRequest.id}>
                            <tr className="border-b border-defaultborder text-[#8c9097] dark:text-white/50">
                                <td className="text-center">{childRequest.sr_number}</td>
                                    <td className="text-center">{childRequest.status}</td>
                                    <td className="text-center">
                                        {new Date(childRequest.created_at).toLocaleString()}
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => onViewTask(childRequest.id)}
                                            className="ti-btn ti-btn-success ti-btn-sm"
                                        >
                                            <i className="ri-eye-line"></i>
                                        </button>
                                    </td>
                                </tr>
                                {childRequest.children && childRequest.children.length > 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-0">
                                            <SubTaskList serviceRequest={childRequest.children} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="p-4 !text-center text-gray-600">
                                No record found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SubTaskList;

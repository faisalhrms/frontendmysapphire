import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import HighlightCell from "@modules/sr-management/component/HighlightCell.jsx";
import Tooltip from "@components/Tooltip.jsx";

export default function RelatedItemsCard({
                                             subTasks = [],
                                             links = []
                                         }) {
    const nav = useNavigate();
    const [tab, setTab] = useState("links");

    const safeArray = v => (Array.isArray(v) ? v : []);
    const items = tab === "sub" ? safeArray(subTasks) : safeArray(links);

    return (
        <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mt-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
                <h2 className="box-title text-lg font-semibold text-gray-700">
                    {tab === "sub" ? "Sub Tasks" : "Linked Requests"}
                </h2>
                <div className="flex gap-2">
                    <button
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tab === "links"
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-600"
                        }`}
                        onClick={() => setTab("links")}
                    >
                        Linked Requests
                    </button>
                    <button
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tab === "sub"
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-600"
                        }`}
                        onClick={() => setTab("sub")}
                    >
                        Sub Tasks
                    </button>
                </div>
            </div>

            {items.length ? (
                <ul className="divide-y divide-gray-200">
                    {items.map(i => (
                        <li
                            key={i.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <i
                                    className={`text-2xl ${
                                        tab === "sub" ? "ri-task-line" : "ri-links-line"
                                    } text-primary`}
                                />
                                <div className="flex flex-col truncate">
                                <span
                                    onClick={() => nav(`/module/srm/taskgeneratedform/${i.id}`)}
                                    className="font-semibold text-defaulttextcolor cursor-pointer hover:underline"
                                >
                                  {i.sr_number}
                                </span>
                                    <Tooltip
                                        id={`request-tooltip-${i.id}`}
                                        text={i.request_title}
                                        tooltipContent={i.request_title}
                                    >
                                        <HighlightCell highlight={!i.is_read}>
                                            {i.request_title.length > 35
                                                ? `${i.request_title.slice(0, 35)}...`
                                                : i.request_title}
                                        </HighlightCell>
                                    </Tooltip>
                                    <span className="text-gray-500">
                                  {i?.employee_info?.concern_person || i?.reporter}
                                </span>
                                </div>
                            </div>
                            <span className="badge bg-primary/10 text-primary">
                             {i?.status || "-"}
                             </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-4 text-center text-gray-600">No record found</div>
            )}


        </div>
    );
}

"use client"

import React, { useState } from "react"
import AvatarList from "@components/AvatarList.jsx";
import {toTitleCase} from "@helpers/formatters.js";
import Tooltip from "@components/Tooltip.jsx";
import {formatDate} from "@helpers/dateTime.js";
import ProgressBar from "@components/ProgressBar.jsx";
import Discussion from "@components/Discussion.jsx";

export default function ProjectManagement({show,setShow , viewData}) {
    const [activeTab, setActiveTab] = useState("updates")
    const [showDropdown, setShowDropdown] = useState(null)


    // Function to handle dropdown toggle
    const toggleDropdown = (tab) => {
        if (showDropdown === tab) {
            setShowDropdown(null)
        } else {
            setShowDropdown(tab)
        }
    }

    // Close dropdown when clicking outside
    const closeDropdown = () => {
        setShowDropdown(null)
    }
    console.log(`this is viewData`,viewData)
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={closeDropdown} style={{zIndex:435344334435434}}>
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-md flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Left side - Task details */}
                <div className="w-[40%] border-r border-gray-200 overflow-y-auto">
                    <h1 className="sticky top-0 text-lg font-bold bg-white p-4 z-10">
                        {viewData?.name || 'Milestone Detail'}
                    </h1>
                    <div className="p-6 ">



                        <div className="mt-1 space-y-3">

                            {/* Name */}
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-user-line"></i>
                                </div>
                                <span className="font-medium">ID</span>
                                <div className="ml-auto p-4 bg-gray-100 text-center  min-w-[225px] max-w-[250px]">
                                    <span>{viewData?.task_no || ''}</span>
                                </div>
                            </div>


                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-indent-increase"></i>
                                </div>
                                <span className="font-medium">Tags</span>
                                <div className="ml-auto p-4 bg-gray-100 text-center  min-w-[225px] max-w-[250px]">
                                    {(
                                        viewData?.tags?.map(tag => (
                                            <span key={tag.id}
                                                  className="badge bg-primary/10 text-primary ml-2">{toTitleCase(tag.name)}</span>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-menu-5-line"></i>
                                </div>
                                <span className="font-medium">Name</span>
                                <div className="ml-auto p-4 bg-gray-100 text-center  min-w-[225px] max-w-[250px]">
                                    <span>{viewData?.name || ''}</span>
                                </div>
                            </div>

                            {/*/!* Person *!/*/}
                            {/*<div className="flex items-center rounded-md">*/}
                            {/*    <div className="w-8 flex items-center justify-center">*/}
                            {/*        <i class="ri-account-pin-circle-line"></i>*/}
                            {/*    </div>*/}
                            {/*    <span className="font-medium">Person</span>*/}
                            {/*    <div className="ml-auto p-4 bg-gray-100 text-center  min-w-[225px] max-w-[250px]">*/}
                            {/*        <div className="w-8 h-8 text-black rounded-full flex items-center justify-center "><AvatarList users={viewData?.users||[]} max={4}/></div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-account-circle-line"></i>
                                </div>
                                <span className="font-medium">Person</span>
                                <div className="ml-auto p-4 bg-gray-100 text-center min-w-[225px] max-w-[250px]">
                                    <div
                                        className="w-8 h-8 text-black rounded-full flex items-center justify-center mx-auto">
                                        <AvatarList users={viewData?.users || []} max={4}/>
                                    </div>
                                </div>
                            </div>

                            {/* Team */}
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-group-line"></i>
                                </div>
                                <span className="font-medium">Team</span>
                                <div className="ml-auto p-4 bg-gray-100 text-center  min-w-[225px] max-w-[250px]">
                                    {(
                                        viewData?.teams?.map(team => (
                                            <span key={team.id}>{toTitleCase(team.name)}</span>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Deadline */}
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-history-line"></i>
                                </div>
                                <span className="font-medium">Deadline</span>
                                <div className="ml-auto flex items-center p-4 bg-gray-100 min-w-[225px] max-w-[250px]">
                                    {/*<i class="ri-calendar-2-line"></i>*/}
                                    {/*<span className="line-through text-gray-400">Jan 14</span>*/}

                                    {
                                        viewData?.completion_timeline !== null ?
                                            <span className="me-6 text-success text-[1rem]">
                                                <Tooltip
                                                    id={`task-tooltip-${viewData?.id}-info`}
                                                    tooltipContent={`${viewData?.completion_timeline < 0 ? `Done ${Math.abs(viewData?.completion_timeline)} days after deadline` : 'Done on time'} `}
                                                >
                                                    {
                                                        viewData?.completion_timeline < 0
                                                            ?
                                                            <i className="ri-information-line cursor-pointer"></i>
                                                            :
                                                            <i className="ri-check-double-line cursor-pointer"></i>
                                                    }
                                                </Tooltip>
                                            </span>
                                            :
                                            (
                                                viewData?.is_overdue ?
                                                    <span className="me-6 text-danger text-[1rem]">
                                                            <Tooltip
                                                                id={`task-tooltip-${viewData?.id}-overdue`}
                                                                tooltipContent={`Task is overdue by ${Math.abs(viewData?.days_left)} days`}
                                                            >
                                                                <i className="ri-information-line cursor-pointer"></i>
                                                            </Tooltip>
                                                        </span>
                                                    :
                                                    <span className="me-6 text-secondary text-[1rem]">
                                                            <Tooltip
                                                                id={`task-tooltip-${viewData?.id}-days_left`}
                                                                tooltipContent={`${Math.abs(viewData?.days_left)} days left`}
                                                            >
                                                                <i className="ri-information-line cursor-pointer"></i>
                                                            </Tooltip>
                                                        </span>
                                            )
                                    }
                                    <span
                                        className={viewData?.completed_at ? 'line-through' : (viewData?.is_overdue ? 'line-through text-danger' : '')}>
                                            {formatDate(viewData?.ended_at)}
                                        </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-bar-chart-horizontal-line"></i>
                                </div>
                                <span className="font-medium">Status</span>
                                <div className="ml-auto p-4 text-center  bg-gray-100 min-w-[225px] max-w-[250px]">
                                    <span className="bg-green-500 rounded-md">{toTitleCase(viewData.status)}</span>
                                </div>
                            </div>

                            {/* Completion Date */}
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="bi bi-calendar2-check"></i>
                                </div>
                                <span className="font-medium">Completion Date</span>
                                <div className="ml-auto p-4 text-center bg-gray-100 min-w-[225px] max-w-[250px]">
                                    <span>{formatDate(viewData?.completed_at)}</span>
                                </div>
                            </div>

                            {/* Status Completion */}
                            <div className="flex items-center  rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="bi bi-check-circle"></i>
                                </div>
                                <span className="font-medium">Status Completion</span>
                                <div className="ml-auto p-4 text-center  bg-gray-100 min-w-[225px] max-w-[250px]">
                                    <span> <ProgressBar value={viewData.progress} barColor='!bg-success'
                                                        withStatus={false}/> </span>
                                </div>
                            </div>
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-wallet-2-line"></i>
                                </div>
                                <span className="font-medium">Aging</span>
                                <div className="ml-auto p-4 text-center bg-gray-100 min-w-[225px] max-w-[250px]">
                                    <span>{viewData?.aging}</span>
                                </div>
                            </div>

                            {/* Timeline Groups */}
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-mist-fill"></i>
                                </div>
                                <span className="font-medium">Timeline Groups</span>
                                <div className="ml-auto p-4 text-center bg-gray-100 min-w-[225px] max-w-[250px]">
                                    <span>{viewData?.time_line_group}</span>
                                </div>
                            </div>

                            {/* Launch */}
                            <div className="flex items-center rounded-md">
                                <div className="w-8 flex items-center justify-center">
                                    <i class="ri-calendar-2-line"></i>
                                </div>
                                <span className="font-medium">Launch</span>
                                <div className="ml-auto p-4 text-center  bg-gray-100 min-w-[225px] max-w-[250px]">
                                    <span>{viewData?.milestoneLaunch}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right side - Files and updates */}
                <div className="flex-1 flex flex-col">
                    {/* Header with close button */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <div></div>
                        <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShow(false)}>
                            <i className="ri-close-line w-5 h-5 text-gray-500"></i>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-4 py-3 flex items-center gap-2 ${
                                activeTab === "updates" ? "border-b-2 border-gray-800" : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("updates")}
                        >
                            <i class="ri-home-6-line"></i>
                            <span>Updates / 1</span>
                            {/*<div className="relative">*/}
                            {/*    <button*/}
                            {/*        className="ml-1 p-1 rounded-full hover:bg-gray-100"*/}
                            {/*        onClick={(e) => {*/}
                            {/*            e.stopPropagation();*/}
                            {/*            toggleDropdown("updates");*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        <i class="bi bi-three-dots"></i>*/}
                            {/*    </button>*/}
                            {/*    {showDropdown === "updates" && (*/}
                            {/*        <div*/}
                            {/*            className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md py-2 w-48 z-10">*/}
                            {/*            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Mark all as*/}
                            {/*                read*/}
                            {/*            </button>*/}
                            {/*            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Notification*/}
                            {/*                settings*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                        </button>
                        <button
                            className={`px-4 py-3 flex items-center gap-2 ${
                                activeTab === "files" ? "border-b-2 border-gray-800" : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("files")}
                        >
                            <i class="bi bi-file-earmark-post"></i>
                            <span>Files</span>
                            {/*<div className="relative">*/}
                            {/*    <button*/}
                            {/*        className="ml-1 p-1 rounded-full hover:bg-gray-100"*/}
                            {/*        onClick={(e) => {*/}
                            {/*            e.stopPropagation();*/}
                            {/*            toggleDropdown("files");*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        <i class="bi bi-three-dots"></i>*/}
                            {/*    </button>*/}
                            {/*    {showDropdown === "files" && (*/}
                            {/*        <div*/}
                            {/*            className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md py-2 w-48 z-10">*/}
                            {/*            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Sort by name*/}
                            {/*            </button>*/}
                            {/*            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Sort by date*/}
                            {/*            </button>*/}
                            {/*            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Download all*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                        </button>
                        {/*<div className="ml-auto px-4 py-3">*/}
                        {/*    <button className="text-gray-500">*/}
                        {/*        <span className="text-2xl">+</span>*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>

                    {/* Content area */}
                    <div className="flex-1 p-4">
                        {activeTab === "updates" && (

                              <Discussion
                                  isHeader={false}
                            storeEndPoint={`/pms/tasks/${viewData.id}/discussion/`}
                            getEndPoint={`/pms/tasks/${viewData.id}/discussions/`}
                            users={viewData.users}
                            />
                        )}

                        {activeTab === "files" && (
                            <div className="h-full">

                                {/* File drop area */}
                                <div className="flex flex-col items-center justify-center h-[calc(100%-60px)] border-2 border-dashed border-gray-300 rounded-lg p-8">
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            {/* Illustration of files and hand */}
                                            <img src="https://cdn.monday.com/images/files-gallery/empty-state-v2.svg" alt="Italian Trull"/>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">Drag & drop or add files here</h3>
                                    <p className="text-gray-600 text-center mb-6">
                                        Upload, comment and review all files in this item to easily collaborate in context
                                    </p>
                                    {/*<button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-md px-6 py-3 text-gray-600">*/}
                                    {/*    <span className="text-xl">+</span>*/}
                                    {/*    <span>Add file</span>*/}
                                    {/*</button>*/}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

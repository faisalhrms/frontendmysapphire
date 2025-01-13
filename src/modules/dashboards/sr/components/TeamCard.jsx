import React from "react";
import { Link } from "react-router-dom";
import placeholder from "@assets/images/faces/avatar.webp";

const TeamCard = ({ data }) => {
    return (
        <div className="xl:col-span-6 col-span-6">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Not-Started</div>
                </div>
                <div className="box-body">
                    <ul
                        className="list-none team-members-card mb-0"
                        style={{
                            maxHeight: "365px", // Adjust height for scroll
                            overflowY: data?.length > 7 ? "auto" : "visible", // Add scroll if more than 7
                        }}
                    >
                        {data.map((item, index) => (
                            <li key={index}>
                                <Link to="#">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start">
                                            <span className="avatar avatar-sm leading-none">
                                                <img
                                                    src={item.avatar?.small_url || placeholder} // Fallback avatar
                                                    alt={`${item.full_name}'s avatar`}
                                                    className="rounded-md"
                                                />
                                            </span>
                                            <div className="ms-4 leading-none">
                                                <span className="font-semibold">{item.full_name}</span>
                                            </div>
                                        </div>
                                        {/* Circular Count */}
                                        <div
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f0f0] text-sm font-semibold text-[#555]"
                                            style={{
                                                minWidth: "32px",
                                                backgroundColor: "#EAF1FB", // Light blue background
                                                color: "#007BFF", // Dark blue text
                                            }}
                                        >
                                            {item.count}
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;

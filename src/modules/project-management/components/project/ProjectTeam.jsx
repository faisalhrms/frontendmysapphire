import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { toTitleCase } from "@helpers/formatters.js";
import Avatar from "@components/Avatar.jsx";
import { Link } from "react-router-dom";

const ProjectTeam = ({ users }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="box accordion sticky top-0 self-start">
        <div className="box-header flex items-center justify-between">
          <div className="box-title mb-2">
            Team Members
            <span className="badge bg-primary/10 !rounded-full text-primary ml-2">
              {users.length}
            </span>
          </div>
          <Link
            aria-label="anchor"
            className="hs-collapse-toggle inline-flex items-center gap-x-2"
            to="#"
            onClick={toggleAccordion}
          >
            <svg
              className={`hs-collapse-open:rotate-180 w-2.5 h-2.5 transition-transform mb-2 ${
                isOpen ? "rotate-180" : ""
              }`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
        {isOpen && (
          <PerfectScrollbar className="box-body max-h-72">
            <ul className="list-none personal-favourite-contacts mb-0">
              {users.map((user) => (
                <li key={user.id}>
                  <div className="flex items-center">
                    <div className="me-2">
                      <Avatar avatar={user.avatar}
                              full_name={user.avatar?.full_name || 'N/A'}/>
                    </div>
                    <div className="flex-grow">
                      <span className="font-semibold">
                        {toTitleCase(user.full_name)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </PerfectScrollbar>
        )}
      </div>
    </>
  );
};

export default ProjectTeam;

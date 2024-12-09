import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModelRight from "@components/ModalRight.jsx";
function ContentLeft({ type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="w-full lg:w-3/5  rounded-lg dark:bg-bodybg">
      <ModelRight isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className="box shadow-md  dark:border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Service Request Info
          </h2>
          <div className="absolute top-4 right-2 ">
            <div className="hs-dropdown ti-dropdown ms-2">
              <button
                type="button"
                aria-label="button"
                className="ti-btn ti-btn-secondary ti-btn-sm"
                aria-expanded="false"
              >
                <i className="ti ti-dots-vertical"></i>
              </button>
              <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                <li className="ti-dropdown-item flex items-center gap-x-2 !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium">
                  <span>Edit</span>
                </li>
                <li className="ti-dropdown-item flex items-center gap-x-2 !py-2 !px-[4 ] !text-[0.8125rem] !font-medium">
                  <span>Update</span>
                </li>
                <li className="ti-dropdown-item flex items-center gap-x-2 !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium">
                  <span>Delete</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4">
          <table className="w-full text-sm text-gray-600">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                  Sr #
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-200">
                  SRIN311024-602
                </td>
                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                  Created At:
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-400">
                  October 31, 2024 at 12:43 PM
                </td>
              </tr>

              <tr className="border-b border-gray-200">
                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                  Need By Date:
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-200">
                  October 31, 2024
                </td>
                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                  Created By:
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-400">
                  MUHAMMAD WAQAS SAEED
                </td>
              </tr>

              <tr>
                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                  CC Employee:
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-200">-</td>
                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                  On Behalf Of:
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-200">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="box shadow-md  dark:border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Description
          </h2>
        </div>

        {type == "first" ? (
          <div className="p-4">
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Executive IT Projects
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
              <p>+92 3126602342</p>

              <p>Sapphire Retail Limited</p>

              <p>
                15-km, Defence Road, Bhobtian Chowk.
                <br />
                Off Raiwind Road, Opposite The University of Lahore.
                <br />
                Lahore, Pakistan.
              </p>

              <p>
                <a
                  href="https://www.sapphireonline.pk"
                  className="text-info underline"
                >
                  www.sapphireonline.pk
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 border-gray-300 dark:border-gray-700">
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Buy a new Server Laptop
            </div>
          </div>
        )}
      </div>

      <div className="box shadow-md  dark:border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="box-title text-lg font-semibold text-gray-700">
            Discussion
          </h2>
        </div>

        <div className="p-4 space-y-4">
          <textarea
            placeholder="Add a comment..."
            className="w-full bg-white dark:bg-bodybg border border-gray-300 dark:border-gray-800 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>

          <div className="flex space-x-4">
            <button className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex ti-btn ti-btn-primary-full  m-2">
              <i class="bi bi-chat-dots h-5 w-5 mr-2"></i>
              Post
            </button>
            <button className=" px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex ti-btn ti-btn-primary-full m-2">
              <i class="bi bi-envelope-check h-5 w-5 mr-2"></i>
              Email
            </button>
          </div>
        </div>
      </div>

      <div className="box custom-box">
        <div className="box-header">
          <div className="box-title">Work log</div>
        </div>
        <div className="box-body">
          <ul className="list-unstyled profile-timeline">
            <li>
              <div>
                <span className="avatar avatar-sm bg-primary/10 !text-primary !rounded-full profile-timeline-avatar">
                  L
                </span>
                <p className="mb-2">
                  <b>You</b> Commented on <b>Work Process</b> in this project{" "}
                  <Link className="text-secondary" to="#!">
                    <u>#New Project</u>
                  </Link>
                  .
                  <span className="float-end text-[0.6875rem] text-[#8c9097] dark:text-white/50">
                    24,Dec 2023 - 14:34
                  </span>
                </p>
                <p className="text-[#8c9097] dark:text-white/50 mb-0">
                  Project is important and need to be completed on time to meet
                  company work flow.
                </p>
              </div>
            </li>
            <li>
              <div>
                <span className="avatar avatar-sm  profile-timeline-avatar">
                  l
                </span>
                <p className="text-[#8c9097] dark:text-white/50 mb-2">
                  <span className="text-default">
                    <b>Json Smith</b> reacted to the project 👍
                  </span>
                  .
                  <span className="float-end text-[0.6875rem] text-[#8c9097] dark:text-white/50">
                    18,Dec 2023 - 12:16
                  </span>
                </p>
              </div>
            </li>

            <li>
              <div>
                <span className="avatar avatar-sm bg-success/10 !text-success !rounded-full profile-timeline-avatar">
                  P
                </span>
                <p className="text-[#8c9097] dark:text-white/50 mb-0">
                  Umer Irfan has been removed from the Team
                </p>
              </div>
            </li>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContentLeft;

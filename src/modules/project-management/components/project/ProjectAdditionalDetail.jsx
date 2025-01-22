import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import {Link} from "react-router-dom";

const ProjectAdditionalDetail = ({project}) => {
    return(
        <>
            <div className="box">
                <div className="box-header justify-between">
                    
                    <div className="box-title">
                        Additional Details
                    </div>
                    <Link aria-label="anchor" className="hs-collapse-toggle inline-flex items-center gap-x-2 "
                          to="#" id="additional-detail-collapse"
                          data-hs-collapse="#additional-detail-collapse-heading">

                        <svg className="hs-collapse-open:rotate-180 w-2.5 h-2.5" width="16" height="16"
                             viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </Link>
                </div>
                <div id="additional-detail-collapse-heading"
                     className="hs-collapse w-full overflow-hidden transition-[height] duration-300 hidden"
                     aria-labelledby="additional-detail-collapse">
                    <div className="box-body !p-0">
                        <div className="table-responsive">
                            <table className="table whitespace-nowrap min-w-full">
                                <tbody>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">ID :</span></td>
                                    <td>{project.project_no}</td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Tags :</span></td>
                                    <td className='space-x-1 rtl:space-x-reverse'>
                                        {(
                                            project.tags.map(tag => (
                                                <span key={tag.id}
                                                      className="badge bg-primary/10 text-primary">{toTitleCase(tag.name)}</span>
                                            ))
                                        )}
                                    </td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Status :</span></td>
                                    <td>
                                        <span
                                            className={getStatusClasses(project.status)}>{toTitleCase(project.status)}</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Priority :</span></td>
                                    <td>
                                    <span
                                        className={getBadgeClasses(project.priority)}>{toTitleCase(project.priority)}</span>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectAdditionalDetail;
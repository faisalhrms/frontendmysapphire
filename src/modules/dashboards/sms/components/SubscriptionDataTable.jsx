import {Link} from "react-router-dom";
import {Courselist} from "@modules/dashboards/sms/subData/subData.jsx";

const subscriptionDataTable = () => {
  return (
      <>
          <div className="xl:col-span-12 col-span-12">
              <div className="box">
                  <div className="box-header justify-between">
                      <div className="box-title">
                          Course List
                      </div>
                      <div className="flex items-center flex-wrap">
                          <div className="me-3 my-1">
                              <input className="ti-form-control form-control-sm" type="text"
                                     placeholder="Search Here" aria-label=".form-control-sm example"/>
                          </div>
                          <div className="hs-dropdown ti-dropdown py-1">
                              <Link to="#"
                                    className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
                                    aria-expanded="false">
                                  Sort By<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                              </Link>
                              <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
                                  <li><Link
                                      className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                      to="#">New</Link></li>
                                  <li><Link
                                      className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                      to="#">Popular</Link></li>
                                  <li><Link
                                      className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                      to="#">Relevant</Link></li>
                              </ul>
                          </div>
                      </div>
                  </div>
                  <div className="box-body">
                      <div className="table-responsive">
                          <table className="table whitespace-nowrap table-bordered min-w-full">
                              <thead>
                              <tr>
                                  <th scope="col" className="text-start">S.No</th>
                                  <th scope="col" className="text-start">Course</th>
                                  <th scope="col" className="text-start">Category</th>
                                  <th scope="col" className="text-start">Classes</th>
                                  <th scope="col" className="text-start">Last Updated</th>
                                  <th scope="col" className="text-start">Instructor</th>
                                  <th scope="col" className="text-start">Students</th>
                                  <th scope="col" className="text-start">Actions</th>
                              </tr>
                              </thead>
                              <tbody>
                              {Courselist.map((idx) => (
                                  <tr className="border-t border-defaultborder dark:border-defaultborder/10"
                                      key={Math.random()}>
                                      <td>
                                          {idx.id}
                                      </td>
                                      <td>
                                          <div className="flex items-center leading-none">
                                              <div className="me-2">
                                                            <span className="avatar avatar-xs ">
                                                                <img src={idx.src} alt="" className="!rounded-md"/>
                                                            </span>
                                              </div>
                                              <div>{idx.name}</div>
                                          </div>
                                      </td>
                                      <td>
                                          {idx.category}
                                      </td>
                                      <td>
                                          {idx.classes}
                                      </td>
                                      <td>
                                          {idx.last}
                                      </td>
                                      <td>
                                          {idx.instructor}
                                      </td>
                                      <td>
                                          {idx.students}
                                      </td>
                                      <td>
                                          <div className="flex flex-row items-center !gap-2 text-[0.9375rem]">
                                              <Link aria-label="anchor" to="#"
                                                    className="ti-btn  ti-btn-wave  !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-info/10 text-info hover:bg-info hover:text-white hover:border-info"><i
                                                  className="ri-pencil-line"></i></Link>
                                              <Link aria-label="anchor" to="#"
                                                    className="ti-btn  ti-btn-wave  !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-danger/10 text-danger hover:bg-danger hover:text-white hover:border-danger"><i
                                                  className="ri-delete-bin-line"></i></Link>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
                  <div className="box-footer">
                      <div className="sm:flex items-center">
                          <div className="text-defaulttextcolor dark:text-defaulttextcolor/70">
                              Showing 5 Entries <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                          </div>
                          <div className="ms-auto">
                              <nav aria-label="Page navigation" className="pagination-style-4">
                                  <ul className="ti-pagination mb-0">
                                      <li className="page-item disabled">
                                          <Link className="page-link" to="#">
                                              Prev
                                          </Link>
                                      </li>
                                      <li className="page-item"><Link className="page-link active" to="#">1</Link>
                                      </li>
                                      <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                      <li className="page-item">
                                          <Link className="page-link !text-primary" to="#">
                                              next
                                          </Link>
                                      </li>
                                  </ul>
                              </nav>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

      </>
  )
}
export default subscriptionDataTable
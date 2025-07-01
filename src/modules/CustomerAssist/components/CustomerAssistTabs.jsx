import {Link} from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import FormSection from "@modules/CustomerAssist/components/CustomerAssistMainList.jsx";
import React from "react";

const CustomerAssistTabs = ({ error, isLoading, data }) => {
    return (
        <>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header sm:flex block !justify-start">
                            <nav
                                aria-label="Tabs"
                                className="md:flex block !justify-start whitespace-nowrap"
                            >
                                <Link
                                    to="#"
                                    className="m-1 block w-full hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow  text-[0.75rem] font-medium rounded-md hover:text-primary active"
                                    id="Personal-item"
                                    data-hs-tab="#online_customer"
                                    aria-controls="#online_customer"
                                >
                                    Online Customer
                                </Link>
                                <Link
                                    to="#"
                                    className="m-1 block w-full hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] flex-grow font-medium rounded-md hover:text-primary "
                                    id="account-item"
                                    data-hs-tab="#complain_at_store"
                                    aria-controls="complain_at_store"
                                >
                                    Complain At Store
                                </Link>
                                <Link
                                    to="#"
                                    className="m-1 block w-full hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] flex-grow font-medium rounded-md hover:text-primary "
                                    id="account-item"
                                    data-hs-tab="#complain_online_dynamics"
                                    aria-controls="complain_online_dynamics"
                                >
                                    Complain Online Dynamics
                                </Link>
                            </nav>

                        </div>
                        <div className='box-body'>
                            <div className="tab-content">
                                <div className="tab-pane show active" id="online_customer"
                                     aria-labelledby="online_customer" role="tabpanel">
                                    {error && (
                                        <div className="mt-2 text-rose-600 text-center font-medium bg-rose-50 border border-rose-200 p-2 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    {isLoading && (
                                        <div className="flex justify-center mt-4">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                    {!isLoading && data && <FormSection data={data} />}
                                </div>
                                <div className="tab-pane hidden" id="complain_at_store"
                                     aria-labelledby="complain_at_store" role="tabpanel">

                                </div>
                                <div className="tab-pane hidden" id="complain_online_dynamics"
                                     aria-labelledby="complain_online_dynamics" role="tabpanel">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};

export default CustomerAssistTabs;

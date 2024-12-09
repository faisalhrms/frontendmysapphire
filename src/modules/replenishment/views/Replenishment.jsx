import React from 'react';
import {Link} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ReplenishmentFrom from "@modules/replenishment/components/ReplenishmentFrom.jsx";
import ReplenishmentHistory from "@modules/replenishment/components/ReplenishmentHistory.jsx";

const Replenishment = () => {
    return (
        <>
            <PageHeader currentpage=" Inventory Demand Forecasting" mainpage="Replenishment" />
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
                                    data-hs-tab="#generate-report"
                                    aria-controls="#generate-report"
                                >
                                    Replenishment
                                </Link>
                                <Link
                                    to="#"
                                    className="m-1 block w-full hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] flex-grow font-medium rounded-md hover:text-primary "
                                    id="account-item"
                                    data-hs-tab="#replenishment-history"
                                    aria-controls="replenishment-history"
                                >
                                    History
                                </Link>
                            </nav>

                        </div>
                        <div className='box-body'>
                            <div className="tab-content">
                                <div className="tab-pane show active" id="generate-report"
                                     aria-labelledby="generate-report" role="tabpanel">
                                    <ReplenishmentFrom />
                                </div>
                                <div className="tab-pane hidden" id="replenishment-history"
                                     aria-labelledby="replenishment-history" role="tabpanel">
                                    <ReplenishmentHistory />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Replenishment;

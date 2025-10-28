import React, {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Grid2x2, Droplet, BadgeDollarSign, Boxes, Waves} from "lucide-react";
import DyeingChargeList from "@modules/customer-hub/master-data/dyeing-charges/views/DyeingChargeList.jsx";
import SizingCostList from "@modules/customer-hub/master-data/sizing-cost/views/SizingCostList.jsx";
import CostIcon from "@modules/customer-hub/master-data/components/CostIcon.jsx";
import CustomerItemList from "@modules/customer-hub/master-data/customer-item-data/views/CustomerItemList.jsx";
import WeavingParameterList from "@modules/customer-hub/master-data/WeavingParameter/views/WeavingParameterList.jsx";
import QualityWeavingList from "@modules/customer-hub/master-data/QualityWeaving/views/QualityWeavingList.jsx";

const MasterData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeStatus, setActiveStatus] = useState(() => searchParams.get("tab") || "quality-weaving");

    useEffect(() => {
        setActiveStatus(searchParams.get("tab") || "quality-weaving");
    }, [searchParams]);

    return (
        <div className="p-3">
            <div className="box">
                <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
                    <nav aria-label="Statuses" className="md:flex block !justify-start whitespace-nowrap">

                        <button
                            onClick={() => setSearchParams({tab: "customer-items"})}
                            className={`relative m-1 w-full py-2 px-3 flex items-center gap-2 text-[0.8rem] font-medium rounded-md ${
                                activeStatus === "customer-items"
                                    ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                                    : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                            }`}
                        >
                            <Boxes className="w-4 h-4 text-primary"/>
                            Customer Items Data
                        </button>

                        <button
                            onClick={() => setSearchParams({tab: "weaving-params"})}
                            className={`relative m-1 w-full py-2 px-3 flex items-center gap-2 text-[0.8rem] font-medium rounded-md ${
                                activeStatus === "weaving-params"
                                    ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                                    : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                            }`}
                        >
                            <Grid2x2 className="w-4 h-4"/>
                            Weaving Parameters
                        </button>
                        <button
                            onClick={() => setSearchParams({tab: "quality-weaving"})}
                            className={`relative m-1 w-full py-2 px-3 flex items-center gap-2 text-[0.8rem] font-medium rounded-md ${
                                activeStatus === "quality-weaving"
                                    ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                                    : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                            }`}
                        >
                            <Waves className="w-4 h-4"/>
                            Quality Weaving
                        </button>
                        <button
                            onClick={() => setSearchParams({tab: "dyeing-charges"})}
                            className={`relative m-1 w-full py-2 px-3 flex items-center gap-2 text-[0.8rem] font-medium rounded-md ${
                                activeStatus === "dyeing-charges"
                                    ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                                    : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                            }`}
                        >
                          <span className="relative inline-flex w-5 h-5 items-center justify-center">
                            <Droplet className={`w-4 h-4 ${activeStatus === "dyeing-charges" ? "text-sky-500" : "text-sky-400"}`}/>
                            <BadgeDollarSign
                                className={`w-3 h-3 absolute -right-1 -bottom-1 ${activeStatus === "dyeing-charges" ? "text-emerald-500" : "text-emerald-400"}`}/>
                          </span>
                            Dyeing Charges
                        </button>
                        <button
                            onClick={() => setSearchParams({tab: "sizing-cost"})}
                            className={`relative m-1 w-full py-2 px-3 flex items-center gap-2 text-[0.8rem] font-medium rounded-md ${
                                activeStatus === "sizing-cost"
                                    ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                                    : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                            }`}
                        >
                            <CostIcon active={activeStatus === "sizing-cost"} currency="pkr"/>
                            Sizing Cost
                        </button>
                    </nav>
                </div>

                {activeStatus === "quality-weaving" && <QualityWeavingList/>}
                {activeStatus === "weaving-params" && <WeavingParameterList/>}
                {activeStatus === "dyeing-charges" && <DyeingChargeList/>}
                {activeStatus === "customer-items" && <CustomerItemList/>}
                {activeStatus === "sizing-cost" && <SizingCostList/>}
            </div>
        </div>
    );
};

export default MasterData;

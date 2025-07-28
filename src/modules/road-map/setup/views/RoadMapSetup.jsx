import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import UnitCategoryList from "@modules/road-map/setup/unit-category/views/UnitCategoryList.jsx";
import UnitList from "@modules/road-map/setup/unit/views/UnitList.jsx";
import ProcessMethodList from "@modules/road-map/setup/process-method/views/ProcessMethodList.jsx";
import DyesMethodList from "@modules/road-map/setup/dyes-method/views/DyesMethodList.jsx";
import StitchTypeList from "@modules/road-map/setup/stitch-type/views/StitchTypeList.jsx";
import SupplierList from "@modules/road-map/setup/suppliers/views/SupplierList.jsx";
import CertificateList from "@modules/road-map/setup/certificates/views/CertificateList.jsx";
import RoadMapProductList from "@modules/road-map/setup/products/views/RoadMapProductList.jsx";
import RoadMapQualityList from "@modules/road-map/setup/quality/views/RoadMapQualityList.jsx";



const RoadMapSetup = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeStatus, setActiveStatus] = useState(() => searchParams.get("tab") || "unit-category");

  useEffect(() => {
    setActiveStatus(searchParams.get("tab") || "unit-category");
  }, [searchParams]);


  return (
    <div className="p-3">
      <div className="box">
        <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
          <nav aria-label="Statuses" className="md:flex block !justify-start whitespace-nowrap">
            <button
              onClick={() => setSearchParams({ tab: "unit-category" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "unit-category"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-stack-fill me-1 text-primary"></i>
               Units Category
            </button>
            <button
              onClick={() => setSearchParams({ tab: "unit" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "unit"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-building-2-line me-1 text-info"></i>
               Units
            </button>
            <button
              onClick={() => setSearchParams({ tab: "process-method" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "process-method"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-flask-line me-1 text-warning"></i>
               Process Methods
            </button>
            <button
              onClick={() => setSearchParams({ tab: "dyes-method" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "dyes-method"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-paint-fill me-1 text-danger"></i>
               Dyes Methods
            </button>
            <button
              onClick={() => setSearchParams({ tab: "stitch-type" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "stitch-type"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-scissors-cut-fill me-1 text-secondary"></i>
               Stitch Types
            </button>
            <button
              onClick={() => setSearchParams({ tab: "supplier" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "supplier"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-truck-line me-1 text-sky-900"></i>
               Suppliers
            </button>
            <button
              onClick={() => setSearchParams({ tab: "certificate" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "certificate"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-award-fill me-1 text-success"></i>
               Certificates
            </button>
            <button
              onClick={() => setSearchParams({ tab: "products" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "products"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-red-packet-line me-1 text-blue"></i>
               Products
            </button>
            <button
              onClick={() => setSearchParams({ tab: "quality" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.8rem] font-medium rounded-md ${
                activeStatus === "quality"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              <i className="ri-price-tag-3-line me-1 text-rose-500"></i>
               Qualities
            </button>
          </nav>
        </div>
          {activeStatus === "unit-category" && <UnitCategoryList />}
          {activeStatus === "unit" && <UnitList />}
          {activeStatus === "process-method" && <ProcessMethodList />}
          {activeStatus === "dyes-method" && <DyesMethodList />}
          {activeStatus === "stitch-type" && <StitchTypeList />}
          {activeStatus === "supplier" && <SupplierList />}
          {activeStatus === "certificate" && <CertificateList />}
          {activeStatus === "products" && <RoadMapProductList />}
          {activeStatus === "quality" && <RoadMapQualityList />}
      </div>
    </div>
  );
};

export default RoadMapSetup;

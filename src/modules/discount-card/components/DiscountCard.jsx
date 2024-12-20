import React, { useState } from "react";
import Logo from "../../../assets/images/company-logos/sapphire.png";
import { Link } from "react-router-dom";

const DiscountCard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user?.email);
  const isAdmin =
    user?.email == "rehab.zafar@srl.com.pk" || "sana.asghar@srl.com.pk";
  const data = [
    { title: "Total Balance", value: "PKR 16,250/-" },
    { title: "Remaining Balance", value: "PKR 16,250/-" },
    { title: "Discount Price", value: "25%" },
    { title: "Max Limit", value: "PKR 0.00/-" },
  ];

  const [selectedOption, setSelectedOption] = useState("card");

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="col-span-12 xl:col-span-6 mt-10">
      <div className="box ">
        <div className="box-body">
          <ul className="list-disc space-x-6 rtl:space-x-reverse">
            <li className="inline-block">
              <button
                className={`px-1 inline-flex items-center gap-2 text-sm whitespace-nowrap text-primary hover:text-primary ${
                  selectedOption === "card" ? "font-bold" : ""
                }`}
                onClick={() => handleSelect("card")}
              >
                Discount Card
              </button>
            </li>
            {isAdmin && (
              <li className="inline-block">
                <button
                  className={`px-1 inline-flex items-center gap-2 text-sm whitespace-nowrap text-primary hover:text-primary ${
                    selectedOption === "email" ? "font-bold" : ""
                  }`}
                  onClick={() => handleSelect("email")}
                >
                  Detail
                </button>
              </li>
            )}
          </ul>

          <div className="mt-4 ">
            {selectedOption === "card" && (
              <div className="flex justify-center  bg-gray-100 bg-white dark:bg-bodybg mt-20 mb-20 ">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl max-w-3xl w-full border dark:border-white rounded-lg">
                  <div className="flex flex-col items-center mb-4 bg-white dark:bg-bodybg">
                    <img
                      src={Logo}
                      alt="Logo"
                      className="h-7 w-40 mb-4 dark:bg-white"
                    />
                    <h4 className="text-2xl font-semibold text-black mb-2 dark:text-white">
                      Administrator
                    </h4>
                    <h6 className="text-sm text-black opacity-80  dark:text-white ">
                      Card No. SGC-2023-297
                    </h6>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6 dark:bg-bodybg">
                    {data.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center border border-black dark:border-white rounded-lg p-4 bg-white dark:bg-bodybg"
                      >
                        <div className="flex justify-between w-full dark:bg-bodybg">
                          <h5 className="text-lg font-semibold text-black dark:text-white">
                            {item.title}:
                          </h5>
                          <h5 className="text-lg font-semibold text-black dark:text-white">
                            {item.value}
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {selectedOption === "email" && (
              <div className="email-content space-y-6">
                <div className="email-section mt-6">
                  <h3 className="text-lg font-semibold text-gray-800  dark:text-white">
                    Email Address
                  </h3>
                  <div className="bg-gray-100 dark:bg-bodybg2 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <span className="text-gray-600 dark:text-white">Email</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <div className="card-section">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Card Number
                  </h3>
                  <div className="bg-gray-100 dark:bg-bodybg2 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <span className="text-gray-600 dark:text-white">
                      Card Number
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      234234
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;

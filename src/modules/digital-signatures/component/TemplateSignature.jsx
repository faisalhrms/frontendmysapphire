import React from "react";
import Img from "../../../assets/images/company-logos/template.png";

const TemplateSignature = ({
  title = true,
  editData = {},
  previewData = null,
  handleChangeTemplate,
  tempStep,
}) => {
  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className="col-span-12">
        <div className="box">
          {title && (
            <div className="box-header">
              <div className="box-title">Templates Signatures</div>
            </div>
          )}

          {tempStep == "all" || tempStep == 1 ? (
            <div className="box-body" onClick={() => handleChangeTemplate(1)}>
              <div className="flex items-center border border-gray-300 rounded-lg p-4 max-w-xl shadow-md bg-white">
                <div className="w-1/3 flex justify-center items-center">
                  <img
                    src={Img}
                    alt="Sapphire Logo"
                    className="h-16 object-contain"
                  />
                </div>

                <div className="border-l-2 bg-warning mx-4 h-28"></div>

                <div className="w-2/3">
                  <h2 className="text-lg font-bold text-blue-800">
                    {(previewData ? previewData?.name : editData?.name) ||
                      "Template_Signature"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {(previewData
                      ? previewData?.department
                      : editData?.department) || "MIS | IT"}
                  </p>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <div className="bg-warning text-white p-2 rounded-full flex items-center justify-center h-8 w-8">
                        <i className="bx bxs-phone-call  text-sm"></i>
                      </div>
                      <p className="ml-2 text-sm text-gray-700">
                        {(previewData ? previewData?.phone : editData?.phone) ||
                          "+92 42 111 000 100 "}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-warning text-white p-2 rounded-full flex items-center justify-center h-8 w-8">
                        <i className="bx bx-microphone  text-sm"></i>
                      </div>
                      <p className="ml-2 text-sm text-gray-700">
                        {(previewData
                          ? previewData?.mobile
                          : editData?.mobile) || "+92 326 4779 707"}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-warning text-white p-2 rounded-full flex items-center justify-center h-8 w-8">
                        <i className="bx bx-location-plus text-sm"></i>
                      </div>
                      <p className="ml-2 text-sm text-gray-700">
                        {(previewData
                          ? previewData?.address
                          : editData?.address) ||
                          "4th Floor, Tricon Corporate Center, Lahore"}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-warning text-white p-2 rounded-full flex items-center justify-center h-8 w-8">
                        <i className="ri-window-2-fill text-sm"></i>
                      </div>
                      <div className="ml-2 text-sm text-gray-700">
                        <a
                          href={
                            editData?.website
                              ? editData?.website
                              : `http://www.sapphiretextiles.com.pk`
                          }
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {(previewData
                            ? previewData?.website
                            : editData?.website) ||
                            "www.sapphiretextiles.com.pk"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* {tempStep == "all" || tempStep == 4 ? (
            <div className="box-body" onClick={() => handleChangeTemplate(4)}>
              <div className="flex items-center border p-4 md:p-6 shadow-md rounded-md max-w-full md:max-w-md bg-white">
                <div className="flex-shrink-0">
                  <img
                    src={Img}
                    alt="Logo"
                    className="h-16 w-16 object-contain"
                  />
                </div>

                <div className="border-l-2 border-yellow-500 mx-4"></div>

                <div className="flex-grow">
                  <h2 className="text-lg font-bold text-blue-800">
                    {(previewData ? previewData?.name : editData?.name) ||
                      "Template"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {(previewData
                      ? previewData?.employee_code
                      : editData?.employee_code) || "MS|IT"}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-center text-sm text-gray-700">
                      <i className="bx bxs-phone-call text-sm   bg-warning"></i>
                      {(previewData ? previewData?.phone : editData?.phone) ||
                        "+92 348433484"}
                    </li>

                    <li className="flex items-center text-gray-700">
                      <i className="bx bx-microphone bg-warning"></i>
                      {(previewData ? previewData?.mobile : editData?.mobile) ||
                        "+92 348433484"}
                    </li>

                    <li className="flex items-center text-gray-700">
                      <i className="bx bx-location-plus bg-warning"></i>
                      {(previewData
                        ? previewData?.address
                        : editData?.address) ||
                        "4th Floor, Tricon Corporate Center, Lahore"}
                    </li>

                    <li className="flex items-center">
                      <i className="ri-window-2-fill bg-warning "></i>

                      <a
                        href={
                          editData?.website
                            ? editData?.website
                            : `http://www.sapphiretextiles.com.pk`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {(previewData
                          ? previewData?.website
                          : editData?.website) || "www.sapphiretextiles.com.pk"}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {tempStep == "all" || tempStep == 2 ? (
            <div className="box-body" onClick={() => handleChangeTemplate(2)}>
              <div className="flex items-center border p-4 md:p-6 shadow-md rounded-md max-w-full md:max-w-md bg-white">
                <div className="border-l-2 border-yellow-500 mx-4"></div>

                <div className="flex-grow">
                  <h2 className="text-lg font-bold text-blue-800">
                    {(previewData ? previewData?.name : editData?.name) ||
                      "new"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {(previewData
                      ? previewData?.employee_code
                      : editData?.employee_code) || "MS|IT"}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-center text-sm text-gray-700">
                      <i className="bx bxs-phone-call text-sm text-yellow-500 "></i>
                      {(previewData ? previewData?.phone : editData?.phone) ||
                        "+92 348433484"}
                    </li>

                    <li className="flex items-center text-gray-700">
                      <i className="bx bx-microphone text-yellow-500 "></i>
                      {(previewData ? previewData?.mobile : editData?.mobile) ||
                        "+92 348433484"}
                    </li>

                    <li className="flex items-center text-gray-700">
                      <i className="bx bx-location-plus text-yellow-500 "></i>
                      {(previewData
                        ? previewData?.address
                        : editData?.address) ||
                        "4th Floor, Tricon Corporate Center, Lahore"}
                    </li>

                    <li className="flex items-center">
                      <i className="ri-window-2-fill text-yellow-500 "></i>
                      <a
                        href={
                          editData?.website
                            ? editData?.website
                            : `http://www.sapphiretextiles.com.pk`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {(previewData
                          ? previewData?.website
                          : editData?.website) || "www.sapphiretextiles.com.pk"}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {tempStep == "all" || tempStep == 3 ? (
            <div className="box-body" onClick={() => handleChangeTemplate(3)}>
              <div className="flex items-center border border-gray-300 rounded-lg p-4 max-w-xl shadow-md bg-white">
                <div className="w-1/3 flex justify-center items-center">
                  <img
                  
                    src={Img}
                    alt="Sapphire Logo"
                    className="h-20 object-contain"
                  />
                </div>

                <div className="border-l-2 bg-warning mx-4 h-32"></div>

                <div className="w-2/3">
                  <h2 className="text-lg font-bold text-blue-800">
                    {(previewData ? previewData?.name : editData?.name) ||
                      "Numan Khan"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {(previewData
                      ? previewData?.employee_code
                      : editData?.employee_code) || "MIS | IT"}
                  </p>

                  <div className="mt-2 space-y-2">
               
                    <div className="flex items-center">
                      <div className="bg-warning text-white p-2 rounded-full flex items-center justify-center h-8 w-8">
                        <i className="bx bxs-phone-call text-sm   bg-warning"></i>
                      </div>
                      <p className="ml-2 text-sm text-gray-700">
                        {(previewData ? previewData?.phone : editData?.phone) ||
                          "+92 42 111 000 100 Ext 6293"}
                      </p>
                    </div>

                
                    <div className="flex items-center">
                      <div className="bg-warning text-white p-2 rounded-full flex items-center justify-center h-8 w-8">
                        <i className="bx bx-microphone bg-warning"></i>
                      </div>
                      <p className="ml-2 text-sm text-gray-700">
                        {(previewData
                          ? previewData?.mobile
                          : editData?.mobile) || "+92 326 4779 707"}
                      </p>
                    </div>

                 
                    <div className="flex items-center">
                      <div className="bg-warning text-white p-2 rounded-full flex items-center justify-center h-8 w-8">
                        <i className="bx bx-location-plus bg-warning"></i>
                      </div>
                      <p className="ml-2 text-sm text-gray-700">
                        {(previewData
                          ? previewData?.address
                          : editData?.address) ||
                          "4th Floor, Tricon Corporate Center, Lahore"}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-warning text-white p-2 rounded-full flex items-center justify-center h-8 w-8">
                        <i className="ri-window-2-fill bg-warning "></i>
                      </div>
                      <div className="ml-2 text-sm text-gray-700">
                        <a
                          href={
                            editData?.website
                              ? editData?.website
                              : `http://www.sapphiretextiles.com.pk`
                          }
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {(previewData
                            ? previewData?.website
                            : editData?.website) ||
                            "www.sapphiretextiles.com.pk"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )} */}
        </div>
      </div>
    </div>
  );
};

export default TemplateSignature;

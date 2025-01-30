import React, { useEffect, useState } from "react";
import { getDynamicTemplates } from "../services/Service";
import Img from "../../../assets/images/company-logos/template.png";

const TemplateSignature = ({
  title = true,
  editData = {},
  previewData = null,
  handleChangeTemplate,
  tempStep,
  companyLogo
}) => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDynamicTemplates();
        setTemplates(res || []);
      } catch (err) {}
    })();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className="col-span-12">
        <div className="box">
          {title && (
            <div className="box-header">
              <div className="box-title">Templates Signatures</div>
            </div>
          )}
          {templates.map((t) => {
            if (tempStep === "all" || tempStep === t.id) {
              return (
                  <div
                      key={t.id}
                      className="box-body"
                  >
                    <div
                        className="flex items-center border border-gray-300 rounded-lg p-4 max-w-xl shadow-md bg-white">
                      <div className="w-1/3 flex justify-center items-center">
                        <img
                            src={t.image_url || companyLogo || Img}
                            alt={t.name || "Template"}
                            className="h-14 object-contain"
                        />
                      </div>
                      <div className="border-l-2 mx-4 h-32" style={{borderColor: "#FBBF24"}}></div>
                      <div className="w-2/3">
                        <h2 className="text-lg font-bold text-blue-800" style={{color: "#FBBF24"}}>
                          {(previewData ? previewData.name : editData.name) || "Name"}
                        </h2>
                        <p className="text-sm text-blue-800">
                          {(previewData ? previewData.title : editData.title) || "Designation"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {(previewData ? previewData.department : editData.department) || "Department"}
                        </p>

                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <div
                                className="bg-warning text-black p-1 rounded-full flex items-center justify-center h-6 w-6">
                              <i className="bx bxs-phone-call text-sm"></i>
                            </div>
                            <p className="ml-2 text-sm text-gray-700">
                              {(previewData ? previewData.phone : editData.phone) || "Phone"}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <div
                                className="bg-warning text-black p-1 rounded-full flex items-center justify-center h-6 w-6">
                              <i className="bx bx-microphone text-sm"></i>
                            </div>
                            <p className="ml-2 text-sm text-gray-700">
                              {(previewData ? previewData.mobile : editData.mobile) || "Mobile"}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <div
                                className="bg-warning text-black p-1 rounded-full flex items-center justify-center h-6 w-6">
                              <i className="bx bx-location-plus text-sm"></i>
                            </div>
                            <p className="ml-2 text-sm text-gray-700">
                              {(previewData ? previewData.address : editData.address) || "Address"}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <div
                                className="bg-warning text-black p-1 rounded-full flex items-center justify-center h-6 w-6">
                              <i className="ri-global-fill text-sm"></i>
                            </div>
                            <div className="ml-2 text-sm text-gray-700">
                              <a
                                  href={
                                    previewData
                                        ? previewData.website
                                        : editData.website || "http://www.sapphiretextiles.com.pk"
                                  }
                                  className="text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                {(previewData ? previewData.website : editData.website) || "http://www.sapphiretextiles.com.pk"}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                          className="cursor-pointer"
                          onClick={() => handleChangeTemplate && handleChangeTemplate(t.id)}
                      >
                        <i className="text-primary text-2xl hover:scale-110 transition-transform bx bx-message-square-edit"/>
                      </div>
                    </div>
                  </div>
              );
            }
            return null;

          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateSignature;

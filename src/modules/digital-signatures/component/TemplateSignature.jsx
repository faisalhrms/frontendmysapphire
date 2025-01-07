import React, { useState } from "react";
import Img from "../../../assets/images/company-logos/template.png";

const TemplateSignature = ({ title = true, handleHide }) => {
  const templates = [
    {
      name: "Classic",
      imgSrc: Img,
    },
    {
      name: "Compact",
      imgSrc: Img,
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const getCardLayout = (templateName) => {
    switch (templateName) {
      case "Wide":
        return "flex-col items-center space-y-6";
      case "Horizontal":
        return "flex-col items-center space-y-6";
      case "Compact":
        return "flex-col items-center space-y-6";
      default:
        return "flex-col items-center";
    }
  };

  const getImageSize = (templateName) => {
    switch (templateName) {
      case "Wide":
        return "h-16 w-16";
      case "Horizontal":
        return "h-16 w-16";
      case "Compact":
        return "h-16 w-16";
      default:
        return "h-24 w-24";
    }
  };

  const getTextAlignment = (templateName) => {
    switch (templateName) {
      case "Wide":
      case "Horizontal":
        return "text-center";
      default:
        return "text-center";
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-4">
      <div className="xxl:col-span-8 col-span-12 sm:col-span-8">
        <div className="box">
          {title && (
            <div className="box-header">
              <div className="box-title">Templates Signatures</div>
            </div>
          )}
          <div className="box-body grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {templates.map((template, index) => (
              <div
                key={index}
                className={`flex border py-4 md:py-6 shadow-md rounded-md bg-white hover:shadow-xl transform transition-transform duration-300 hover:scale-105 cursor-pointer ${getCardLayout(
                  template.name
                )}`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className={`flex-shrink-0 ${getImageSize(template.name)}`}>
                  <img
                    src={template.imgSrc}
                    alt={`${template.name} Logo`}
                    className="object-contain"
                    onClick={handleHide}
                  />
                </div>
                <h2
                  className={`text-lg font-bold text-gray-800 ${getTextAlignment(
                    template.name
                  )}`}
                >
                  {template.name}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="xxl:col-span-4 col-span-12 sm:col-span-4">
        <div className="box">
          <div className="box-header">
            <div className="box-title">Preview</div>
          </div>
          <div className="box-body border border-gray-300 rounded-md p-4 bg-gray-50 flex justify-center items-center">
            {selectedTemplate ? (
              <div
                className={`flex border py-4 md:py-6 shadow-md rounded-md bg-white ${getCardLayout(
                  selectedTemplate.name
                )}`}
              >
                <div
                  className={`flex-shrink-0 ${getImageSize(
                    selectedTemplate.name
                  )}`}
                >
                  <img
                    src={selectedTemplate.imgSrc}
                    alt={`${selectedTemplate.name} Logo`}
                    className="object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-400">
                Click on a template to preview here.
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-4 mt-4 mr-4 mb-4">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md"
              onClick={() => setSelectedTemplate(templates[0])}
            >
              clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSignature;

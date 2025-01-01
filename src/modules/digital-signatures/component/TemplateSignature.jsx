import React from "react";
import Img from "../../../assets/images/company-logos/template.png";

const TemplateSignature = ({ title = true }) => {
  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className="col-span-12">
        <div className="box">
          {title && (
            <div className="box-header">
              <div className="box-title">Templates Signatures</div>
            </div>
          )}
          <div className="box-body">
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
                <h2 className="text-lg font-bold text-blue-800">Numan Khan</h2>
                <p className="text-sm text-gray-600">MIS | IT</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center text-sm text-gray-700">
                    <i className="bx bxs-phone-call text-sm text-yellow-500 "></i>
                    +92 42 111 000 100 Ext 6293
                  </li>

                  <li className="flex items-center text-gray-700">
                    <i className="bx bx-microphone text-yellow-500 "></i>
                    +92 326 4779 707
                  </li>

                  <li className="flex items-center text-gray-700">
                    <i className="bx bx-location-plus text-yellow-500 "></i>
                    4th Floor, Tricon Corporate Center, Lahore
                  </li>

                  <li className="flex items-center">
                    <i className="ri-window-2-fill text-yellow-500 "></i>
                    <a
                      href="http://www.sapphiretextiles.com.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      www.sapphiretextiles.com.pk
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSignature;

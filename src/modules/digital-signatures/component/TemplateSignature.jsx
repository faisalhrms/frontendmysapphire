import React from "react";
import Img from "../../../assets/images/company-logos/template.png";

const TemplateSignature = ({ title = true }) => {
  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className="xxl:col-span-12">
        <div className="box">
          {title && (
            <div className="box-header">
              <div className="box-title">Templates Signatures</div>
            </div>
          )}
          <div className="box-body">
            {" "}
            <div className="flex items-center border p-6 shadow-md rounded-md max-w-md ">
              {/* Logo Section */}
              {title ? (
                <div className="flex-shrink-0">
                  <img
                    src={Img} // Replace with your logo URL
                    alt="Logo"
                    className="h-13"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <img
                    src={Img} // Replace with your logo URL
                    alt="Logo"
                    className="h-10"
                  />
                </div>
              )}

              {/* Divider */}
              <div className="border-l-2 border-yellow-500 mx-4"></div>

              {/* Information Section */}
              <div>
                <h2 className="text-lg font-bold text-blue-800">Numan Khan</h2>
                <p className="text-gray-600">MIS | IT</p>
                <ul className="mt-3 space-y-1">
                  {/* Phone Number */}
                  <li className="flex items-center text-gray-700">
                    <span className="material-icons text-yellow-500 mr-2">
                      <i class="bx bxs-phone-call"></i>
                    </span>
                    +92 42 111 000 100 Ext 6293
                  </li>
                  {/* Mobile */}
                  <li className="flex items-center text-gray-700">
                    <span className="material-icons text-yellow-500 mr-2">
                      <i class="bx bx-microphone"></i>
                    </span>
                    +92 326 4779 707
                  </li>
                  {/* Address */}
                  <li className="flex items-center text-gray-700">
                    <span className="material-icons text-yellow-500 mr-2">
                      <i class="bx bx-location-plus"></i>
                    </span>
                    4th Floor, Tricon Corporate Center, Lahore
                  </li>
                  {/* Website */}
                  <li className="flex items-center">
                    <span className="material-icons text-yellow-500 mr-2">
                      <i class="ri-window-2-fill"></i>
                    </span>
                    <a
                      href="http://www.sapphiretextiles.com.pk"
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

import React from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import stm4 from "@assets/images/road-map/STM-4.png";
import stm5 from "@assets/images/road-map/STM-5.png";
import stm6 from "@assets/images/road-map/STM-6.png";
import stm7 from "@assets/images/road-map/STM-7.png";
import stm9 from "@assets/images/road-map/STM-9.png";
import stm10 from "@assets/images/road-map/STM-10.png";

const mediaByUnit = {
  "stm-4": { img: stm4, addr: "63/64-KM, Multan Road, Jumber Khurd,Chunian, District Kasur", video: "https://youtu.be/uYB8xy1RB3Y" },
  "stm-5": { img: stm5, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/uYB8xy1RB3Y" },
  "stm-6": { img: stm6, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/JHrh59H2GZE" },
  "stm-7": { img: stm7, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/sQqD6sJXyvE" },
  "stm-9": { img: stm9, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/4ABaiJrhDWY" },
  "stm-10": { img: stm10, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/cWBTrfAM3nc" }
};

export default function CertificateCanvas({ id = "hs-overlay-right", unitName, groups = {} }) {
  const key = unitName?.toLowerCase() || "";
  const meta = mediaByUnit[key] || {};
  const badgeClass = (status, days) => {
    if (status === "N/A") return "bg-info text-white";
    if (days < 0) return "bg-danger text-white";
    if (days <= 15) return "bg-warning text-white";
    return status.toLowerCase() === "membership" ? "bg-success text-white" : "bg-primary/20 text-primary";
  };

  return (
    <div id={id} className="hs-overlay hidden ti-offcanvas ti-offcanvas-right dark:bg-gray-800" tabIndex={-1}>
      <div className="ti-offcanvas-header border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h6 className="ti-offcanvas-title font-semibold text-gray-900 dark:text-gray-100">
          Certificate Details <span className="font-bold">{unitName}</span>
        </h6>
        <button type="button" className="ti-btn text-gray-700 dark:text-gray-300" data-hs-overlay={`#${id}`}>×</button>
      </div>
      <div className="ti-offcanvas-body overflow-y-auto space-y-6 py-4 bg-white dark:bg-gray-800">
        {meta.img && (
          <div className="mx-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex">
            <div className="flex-1 p-4 text-sm text-gray-700 dark:text-gray-300">{meta.addr}</div>
            <div className="relative">
              <img src={meta.img} alt={unitName} className="w-40 h-30 object-cover rounded-r" />
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center"
                onClick={() => meta.video && window.open(meta.video, "_blank")}
              >
                <i className="ri-play-circle-fill text-5xl text-white/90" />
              </button>
            </div>
          </div>
        )}
        {Object.entries(groups).map(([type, certs]) => (
          <div key={type} className="mx-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
            <div className="text-center py-1 rounded-t-xl bg-sky-300 dark:bg-sky-600">
              <span className="text-sm tracking-wide text-white">{type}</span>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2 text-left w-52">Certificate</th>
                  <th className="px-4 py-2 text-left w-24">Status</th>
                  <th className="px-4 py-2 text-left w-32">Expiry Date</th>
                  <th className="px-2 py-2 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {certs.map(c => {
                  const days = c.expiry_date ? differenceInCalendarDays(parseISO(c.expiry_date), new Date()) : 0;
                  const badge = badgeClass(c.status, days);
                  const parts = c.certificate.name.split(" ");
                  const first = parts.slice(0, 2).join(" ");
                  const rest = parts.slice(2).join(" ");
                  return (
                    <tr key={c.certificate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {c.certificate.media ? (
                            <span className="avatar avatar-lg">
                              <img src={c.certificate.media.medium_url} alt={c.certificate.name} />
                            </span>
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <i className="ri-certificate-line text-lg text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                          <div className="flex flex-col text-xs font-medium text-gray-800 dark:text-gray-100">
                            <span className="truncate-m">{first}</span>
                            {rest && <span className="truncate-m">{rest}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${badge}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
                        {c.expiry_date || "-"}
                      </td>
                      <td className="px-2 py-3 text-right">
                        {c.certificate.media && (
                          <button
                            type="button"
                            onClick={() => window.open(c.certificate.media.file_url, "_blank")}
                            className="ti-btn ti-btn-success ti-btn-sm"
                            title="Download / View"
                          >
                            <i className="ri-download-line" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
        {Object.keys(groups).length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">No certificates assigned.</p>
        )}
      </div>
    </div>
  );
}

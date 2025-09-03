import React from "react"
import { differenceInCalendarDays, parseISO } from "date-fns"
import stm4 from "@assets/images/road-map/STM-4.png"
import stm5 from "@assets/images/road-map/STM-5.png"
import stm6 from "@assets/images/road-map/STM-6.png"
import stm7 from "@assets/images/road-map/STM-7.png"
import stm9 from "@assets/images/road-map/STM-9.png"
import stm10 from "@assets/images/road-map/STM-10.png"

const mediaByUnit = {
  "stm-4": { img: stm4, addr: "63/64-KM, Multan Road, Jumber Khurd,Chunian, District Kasur", video: "https://youtu.be/uYB8xy1RB3Y" },
  "stm-5": { img: stm5, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/uYB8xy1RB3Y" },
  "stm-6": { img: stm6, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/JHrh59H2GZE" },
  "stm-7": { img: stm7, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/sQqD6sJXyvE" },
  "stm-9": { img: stm9, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/4ABaiJrhDWY" },
  "stm-10": { img: stm10, addr: "1.5-KM, Warburton Road, Feroze Wattoan, Sheikhupura", video: "https://youtu.be/cWBTrfAM3nc" }
}

export default function CertificateCanvas({ id = "hs-overlay-right", unitName, groups = {} }) {
  const key = unitName?.toLowerCase() || ""
    const meta = mediaByUnit[key] || {}
    const badgeClass = (status, days) => {
        if (status === "Membership") return "badge bg-success/10 text-success"
        if (status === "Renewal") return "badge bg-info/10 text-info"
        if (status === "N/A") return "badge bg-info/10 text-info"
        if (days < 0) return "badge bg-danger/10 text-danger"
        if (days <= 15) return "badge bg-warning/10 text-warning"
        if (status === "Active") return "badge bg-success/10 text-success"
        return "badge bg-primary/10 text-primary"
    }
  return (
    <div id={id} className="hs-overlay hidden ti-offcanvas ti-offcanvas-right !max-w-[35rem]">
      <div className="ti-offcanvas-header border-b">
        <h6 className="ti-offcanvas-title">Certificate Details <span className="font-bold">{unitName}</span></h6>
        <button type="button" className="ti-btn" data-hs-overlay={`#${id}`}>×</button>
      </div>
      <div className="ti-offcanvas-body space-y-4">
        {meta.img && (
        <div className="box">
          <div className="box-body">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[0.9375rem]">{meta.addr}</div>
              <div className="relative w-50 h-24 rounded-md overflow-hidden shrink-0">
                <img src={meta.img} alt={unitName} className="w-full h-24" />
                {meta.video && (
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={() => window.open(meta.video, "_blank")}
                  >
                    <i className="ri-play-circle-fill text-5xl text-white/90" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
        {Object.entries(groups).map(([type, certs]) => (
          <div key={type} className="box">
            <div className="box-header justify-between">
              <div className="box-title">{type}</div>
            </div>
            <div className="box-body !p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="text-start">Certificate</th>
                      <th scope="col" className="text-start">Status</th>
                      <th scope="col" className="text-start">Expiry</th>
                      <th scope="col" className="text-start">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.map((c, i) => {
                      const days = c.expiry_date ? differenceInCalendarDays(parseISO(c.expiry_date), new Date()) : 0
                      const b = badgeClass(c.status, days)
                      const sep = i === 0 ? "" : "border-t border-defaultborder dark:border-defaultborder/10"
                      return (
                        <tr key={c.certificate.id} className={sep}>
                          <th scope="row">
                            <div className="flex items-center">
                              <div className="me-2">
                                <span className="avatar avatar-lg avatar-rounded transition-transform duration-150 hover:scale-110">
                                  {c.certificate.media ? <img src={c.certificate.media.medium_url} alt="" /> : <i className="ri-certificate-line text-[1.25rem]" />}
                                </span>
                              </div>
                              <div>
                                <span className="block">{c.certificate.name}</span>
                                <span className="block text-[0.75rem] text-[#8c9097] dark:text-white/50">{c.scope || ""}</span>
                              </div>
                            </div>
                          </th>
                          <td><span className={b}>{c.status}</span></td>
                         <td>
                              <span
                                className={
                                  days < 0
                                    ? "badge bg-danger/10 text-danger"
                                    : days <= 15
                                    ? "badge bg-warning/10 text-warning"
                                    : "badge bg-light text-default"
                                }
                              >
                                {c.expiry_date || "-"}
                              </span>
                         </td>
                          <td>
                            <div className="flex flex-row items-center !gap-2 text-[0.9375rem]">
                              {c.media?.file_url && (
                                <a
                                  href={c.media.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="ti-btn ti-btn-wave !rounded-full !border-primary/10 !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-primary/10 text-primary hover:bg-primary hover:text-white hover:border-primary"
                                  title="Download"
                                >
                                  <i className="ri-download-line" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
        {Object.keys(groups).length === 0 && (
          <div className="box">
            <div className="box-body">
              <p className="text-center text-[0.9375rem] text-[#8c9097] dark:text-white/50">No certificates assigned.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

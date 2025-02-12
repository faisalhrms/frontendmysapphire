import demoFile from "@assets/video/pms-demo.webm";

const PmsDemoModal = () => {

    return (
        <>
            <div id="pms_demo_modal" className="hs-overlay hidden ti-modal  [--overlay-backdrop:static]">
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                    <div className="ti-modal-content">
                        <div className="ti-modal-header">
                            <h6 className="modal-title text-[1rem] font-semibold">PMS Demo</h6>
                            <button type="button"
                                    className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                                    data-hs-overlay="#pms_demo_modal">
                                <span className="sr-only">Close</span>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="ti-modal-body px-4">
                          <video
                              controls
                              src={demoFile}
                          />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PmsDemoModal
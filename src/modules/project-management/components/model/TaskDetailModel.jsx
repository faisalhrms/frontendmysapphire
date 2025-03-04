import React from "react";

const TaskDetailModel = ({}) => {
    return (
        <>
            <div
                id="taskDetailModal"
                data-hs-overlay-keyboard="false"
                className="hs-overlay ti-modal hidden [--overlay-backdrop:static] backdrop-blur-[0.08rem] parent-modal"
            >
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out lg:!max-w-4xl lg:w-full m-3 lg:!mx-auto">
                    <div className="ti-modal-content">

                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskDetailModel;

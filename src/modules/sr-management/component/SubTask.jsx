import React from "react";

const SubTask = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
        <p>
          <span className="font-semibold">SR Number</span>{" "}
        </p>
        <p>
          <span className="font-semibold">Status</span>{" "}
        </p>
        <p>
          <span className="font-semibold">Created At</span>{" "}
        </p>
        <span className="font-semibold">Comment</span>{" "}
      </div>
    </>
  );
};

export default SubTask;

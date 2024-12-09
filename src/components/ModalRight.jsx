import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditNeedByDateModal = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative dark:bg-gray-800">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
            <h6 className="text-lg font-bold dark:text-white">
              Edit Need By Date
            </h6>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Select Start Date"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
        <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2 border-t border-dashed dark:border-defaultborder/10 sm:flex ti-btn ti-btn-primary-full m-2"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

const ModelRight = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <EditNeedByDateModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  );
};

export default ModelRight;

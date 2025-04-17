import React from 'react';

const MilestoneDetailModel = ({ isOpen, setIsOpen, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative p-4 rounded-lg shadow-lg w-[1200px] bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className=" text-sm font-semibold">{title}</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-xl font-bold text-gray-600 hover:text-gray-800"
                    >
                        X
                    </button>
                </div>
                <div className="flex flex-col h-screen bg-gray-100">
                    <div className="bg-white shadow-sm w-full mx-auto flex flex-col">{children}</div>
                </div>
            </div>
            </div>
            );
            };

            export default MilestoneDetailModel;




import React from 'react';
import { TrendingUp, HardDrive } from 'lucide-react';

const ProfileSidebar = ({ totalObjectives, totalWeightage }) => {
    return (
        <div className="xxl:col-span-4 xl:col-span-12 col-span-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-primary p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <img
                            src="http://127.0.0.1:8000/media/uploads/2025/01/09/kinza-sm.jpg"
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                            }}
                        />
                    </div>
                    <h3 className="text-white font-bold text-lg">Kinza</h3>
                    <p className="text-purple-100 text-sm">Software Engineer</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">Employee Code</span>
                        <span className="font-semibold text-gray-900">EMP-2024-001</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">Date of Joining</span>
                        <span className="font-semibold text-gray-900">Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">Reporting To</span>
                        <span className="font-semibold text-gray-900">John Smith</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 text-sm">Objective Status</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              In Progress
            </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600"/>
                    Quick Stats
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total KRAs</span>
                        <span className="font-bold text-primary">{totalObjectives}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Weightage Progress</span>
                        <span className={`font-bold ${totalWeightage === 100 ? 'text-success' : 'text-primary'}`}>
              {totalWeightage}%
            </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${
                                totalWeightage === 100 ? 'bg-success' :
                                    totalWeightage > 100 ? 'bg-danger' : 'bg-primary'
                            }`}
                            style={{width: `${Math.min(totalWeightage, 100)}%`}}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
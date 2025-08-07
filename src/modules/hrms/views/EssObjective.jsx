import React, { useState } from 'react';
import {
    User,
    Download,
    Eye,
    Plus,
    Edit3,
    Trash2,
    Calendar,
    FileText,
    Target,
    Award,
    Settings,
    Users,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Save,
    HardDrive
} from 'lucide-react';
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const ObjectivesForm = () => {
    const [objectives, setObjectives] = useState([
        {
            id: 1,
            kra: '',
            kpi: '',
            weightage: '',

        },
    ]);

    const [actionHistory] = useState([
        { name: 'Rehab Zafar', type: 'Objectives', action: 'Submit', date: '4/19/2025 12:35pm', remarks: 'Initial submission for Q2 objectives' },
        { name: 'Sana Asghar', type: 'Objectives', action: 'Approved', date: '5/19/2025 12:35pm', remarks: 'Approved with minor modifications' },
    ]);

    const [activeTab, setActiveTab] = useState('objectives');

    const addObjective = () => {
        setObjectives([...objectives, {
            id: Date.now(),
            kra: '',
            kpi: '',
            weightage: '',

        }]);
    };

    const removeObjective = (id) => {
        if (objectives.length > 1) {
            setObjectives(objectives.filter(obj => obj.id !== id));
        }
    };

    const updateObjective = (id, field, value) => {
        setObjectives(objectives.map(obj =>
            obj.id === id ? { ...obj, [field]: value } : obj
        ));
    };

    const getTotalWeightage = () => {
        return objectives.reduce((total, obj) => {
            return total + (parseFloat(obj.weightage) || 0);
        }, 0);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <IconPageHeader
                heading="Objective"
                description="My Objective - From view"


                icon={HardDrive}
            />
        <div className="min-h-screen  p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-12 gap-x-6">

                    <div className="xxl:col-span-4 xl:col-span-12 col-span-12">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-primary p-6 text-center">
                                <div
                                    className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white shadow-lg overflow-hidden">
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
                                    <span
                                        className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
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
                                    <span className="font-bold text-primary">{objectives.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Weightage Progress</span>
                                    <span
                                        className={`font-bold ${getTotalWeightage() === 100 ? 'text-success' : 'text-primary'}`}>
                                        {getTotalWeightage()}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full  ${
                                            getTotalWeightage() === 100 ? 'bg-success' :
                                                getTotalWeightage() > 100 ? 'bg-danger' : 'bg-primary'
                                        }`}
                                        style={{width: `${Math.min(getTotalWeightage(), 100)}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="xxl:col-span-8">

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('objectives')}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                                        activeTab === 'objectives'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 bg-gray-50'
                                    }`}
                                >
                                    <Award className="w-4 h-4 inline mr-2"/>
                                    KRA Objectives
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                                        activeTab === 'history'
                                            ? 'bg-primary  text-white'
                                            : 'text-gray-600 bg-gray-50'
                                    }`}
                                >
                                    <FileText className="w-4 h-4 inline mr-2"/>
                                    Action History
                                </button>
                            </div>

                            {activeTab === 'objectives' && (
                                <div className="p-6">
                                    <div className="mb-6 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Key Result Areas &
                                                Performance Objectives</h2>
                                            <p className="text-gray-600 text-sm mt-1">Define your key performance
                                                indicators and measurable objectives</p>
                                        </div>
                                        <button
                                            onClick={addObjective}
                                            className="px-4 py-2  bg-primary text-white font-medium rounded-lg shadow-md flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-2"/>
                                            Add KRA
                                        </button>


                                    </div>

                                    <div
                                        className="space-y-6 overflow-y-auto max-h-[600px] pr-2"
                                    >
                                        {objectives.map((objective, index) => (
                                            <div
                                                key={objective.id}
                                                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-bold text-white">
              {index + 1}
            </span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            KRA {index + 1}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {objectives.length > 1 && (
                                                            <button
                                                                onClick={() => removeObjective(objective.id)}
                                                                className="p-2 text-danger rounded-lg transition-colors"
                                                                title="Remove KRA"
                                                            >
                                                                <i className="bi bi-trash3 w-4 h-4"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            KRA
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control w-full !rounded-sm border "
                                                            placeholder="KRA"
                                                            value={objective.kra}
                                                            onChange={(e) =>
                                                                updateObjective(objective.id, 'kra', e.target.value)
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Weightage
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                step="0.1"
                                                                className="form-control w-full !rounded-sm border "
                                                                placeholder="25"
                                                                value={objective.weightage}
                                                                onChange={(e) =>
                                                                    updateObjective(objective.id, 'weightage', e.target.value)
                                                                }
                                                            />
                                                            <span
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 font-semibold">
              %
            </span>
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            KPI - Performance Objectives
                                                        </label>
                                                        <textarea
                                                            rows="3"
                                                            className="form-control w-full !rounded-sm border "
                                                            placeholder="Describe specific, measurable objectives for this KRA..."
                                                            value={objective.kpi}
                                                            onChange={(e) =>
                                                                updateObjective(objective.id, 'kpi', e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>


                                    <div className={`mt-6 p-4 rounded-xl border-2 ${
                                        getTotalWeightage() === 100
                                            ? 'bg-green-50 border-green-200'
                                            : getTotalWeightage() > 100
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-amber-50 border-amber-200'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {getTotalWeightage() === 100 ? (
                                                    <CheckCircle2 className="w-6 h-6 text-green-600 mr-3"/>
                                                ) : (
                                                    <AlertCircle className="w-6 h-6 text-amber-600 mr-3"/>
                                                )}
                                                <div>
                                                    <p className={`font-semibold ${
                                                        getTotalWeightage() === 100 ? 'text-green-800' : 'text-amber-800'
                                                    }`}>
                                                        Total Weightage: {getTotalWeightage()}%
                                                    </p>
                                                    <p className={`text-sm ${
                                                        getTotalWeightage() === 100 ? 'text-green-600' : 'text-amber-600'
                                                    }`}>
                                                        {getTotalWeightage() === 100
                                                            ? 'Perfect! All KRAs are properly weighted.'
                                                            : getTotalWeightage() > 100
                                                                ? 'Total exceeds 100%. Please adjust weightages.'
                                                                : 'Total should equal 100%. Please adjust weightages.'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`text-2xl font-bold ${
                                                getTotalWeightage() === 100 ? 'text-green-600' : 'text-amber-600'
                                            }`}>
                                                {getTotalWeightage()}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Action History</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="bg-gray-50  ">
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-200">Name</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-200">Type</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-200">Action</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-200">Date</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-200">Remarks</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {actionHistory.map((action, index) => (
                                                <tr key={index} className="">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                                <User className="w-4 h-4 text-gray-600"/>
                                                            </div>
                                                            <span
                                                                className="font-medium text-gray-900">{action.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                            <span
                                                                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                {action.type}
                                                            </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                            <span
                                                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                                    action.action === 'Approved'
                                                                        ? 'bg-green-100 text-green-800'
                                                                    : action.action === 'Submit'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {action.action}
                                                            </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{action.date}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{action.remarks || '-'}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <button className="px-6 py-3  bg-primary text-white font-medium rounded-lg shadow-md transition-all flex items-center">
                                <Save className="w-4 h-4 mr-2" />
                                Save Draft
                            </button>
                            <button
                                className={`px-6 py-3 font-medium rounded-lg shadow-md transition-all flex items-center ${
                                    getTotalWeightage() === 100
                                        ? 'bg-success  text-white'
                                        : 'bg-success text-white cursor-not-allowed'
                                }`}
                                disabled={getTotalWeightage() !== 100}
                            >
                                <Target className="w-4 h-4 mr-2" />
                                Submit for Approval
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default ObjectivesForm;



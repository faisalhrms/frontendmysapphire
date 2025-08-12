import ProfileSidebar from "@modules/employee-self-services/objectives/components/ProfileSidebar.jsx";
import {Award, FileText, Plus, Save, Target} from "lucide-react";
import ObjectiveCard from "@modules/employee-self-services/objectives/components/ObjectiveCard.jsx";
import ActionHistory from "@modules/employee-self-services/objectives/components/ActionHistory.jsx";
import WeightageStatus from "@modules/employee-self-services/objectives/components/WeightageStatus.jsx";
import React, {useState} from "react";
import AlertModal from "@components/AlertModal.jsx";
import {useObjectiveForm} from "@modules/employee-self-services/objectives/hooks/useObjectiveForm.js";

const ObjectiveForm = ({year = null, editMode = false, active = true,userData}) => {
    const [activeTab, setActiveTab] = useState('objectives');
    const [isActive, setIsActive] = useState(active);

    const {
        fields,
        append,
        remove,
        handleSubmit,
        control,
        errors,
        getTotalWeightage,
        isWeightageValid,
        handleActionClick,
        onSubmitForApproval,
        onSaveDraft: saveDraftHandler,
        isModalOpen,
        setIsModalOpen,
        isSubmitting,
    } = useObjectiveForm(year, editMode);

    const [isSavingDraft, setIsSavingDraft] = useState(false);

    const onSaveDraft = async (data) => {
        try {
            setIsSavingDraft(true);
            await saveDraftHandler(data);
        } finally {
            setIsSavingDraft(false);
        }
    };


    const toggleActive = () => setIsActive(!isActive);




    return (
        <>
            <div className={`transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-50 pointer-events-none'
            }`}>
                <form>
                    <div className="grid grid-cols-12 gap-x-6">
                        {isActive && (
                            <ProfileSidebar
                                userData={userData}
                                totalObjectives={fields.length}
                                totalWeightage={getTotalWeightage()}
                            />


                        )}

                        <div className={`transition-all duration-300 ${
                            isActive ? 'xxl:col-span-8' : 'col-span-12'
                        }`}>
                            <div
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">

                                <div className={`transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-slate-50 via-slate-50 to-white border-b border-slate-200/80 dark:text-gray-200 dark:bg-bodybg'
                                        : 'bg-slate-100 border-b border-slate-300'
                                }`}>
                                    <div className="flex items-center justify-between px-6 py-4 dark:text-gray-200 dark:bg-bodybg">
                                        <div className="flex space-x-1 bg-slate-100/60 rounded-xl p-1">
                                            <button
                                                type="button"
                                                onClick={() => isActive && setActiveTab('objectives')}
                                                disabled={!isActive}
                                                className={`
                                relative flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap
                                ${!isActive ? 'cursor-not-allowed opacity-60' : ''}
                                ${activeTab === 'objectives' && isActive
                                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50'
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                                }
                            `}
                                            >
                                                <div className={`
                                flex items-center justify-center w-5 h-5 rounded-md mr-2 transition-all duration-300
                                ${activeTab === 'objectives' && isActive
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-slate-300 text-slate-600'
                                                }
                            `}
                                                     style={activeTab === 'objectives' && isActive ? {background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'} : {}}>
                                                    <Award className="w-3 h-3"/>
                                                </div>
                                                KRA Objectives
                                                {activeTab === 'objectives' && isActive && (
                                                    <div
                                                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                                        <div className="w-1 h-1 rounded-full"
                                                             style={{background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)'}}></div>
                                                    </div>
                                                )}
                                            </button>

                                            {editMode && (
                                                <button
                                                    type="button"
                                                    onClick={() => isActive && setActiveTab('history')}
                                                    disabled={!isActive}
                                                    className={`
                                    relative flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap
                                    ${!isActive ? 'cursor-not-allowed opacity-60' : ''}
                                    ${activeTab === 'history' && isActive
                                                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                                    }
                                `}
                                                >
                                                    <div className={`
                                    flex items-center justify-center w-5 h-5 rounded-md mr-2 transition-all duration-300
                                    ${activeTab === 'history' && isActive
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-300 text-slate-600'
                                                    }
                                `}
                                                         style={activeTab === 'history' && isActive ? {background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)'} : {}}>
                                                        <FileText className="w-3 h-3"/>
                                                    </div>
                                                    Action History
                                                    {activeTab === 'history' && isActive && (
                                                        <div
                                                            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                                            <div className="w-1 h-1 rounded-full"
                                                                 style={{background: 'linear-gradient(90deg, #10b981 0%, #0d9488 100%)'}}></div>
                                                        </div>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            {activeTab === 'objectives' && isActive && (
                                                <button
                                                    type="button"
                                                    onClick={append}
                                                    disabled={!isActive}
                                                    className="group flex items-center px-4 py-2 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                    style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}
                                                >
                                                    <div
                                                        className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-lg mr-2 group-hover:bg-white/30 transition-all duration-200">
                                                        <Plus className="w-3 h-3"/>
                                                    </div>
                                                    Add KRA
                                                </button>
                                            )}
                                            {activeTab === 'history' && editMode && isActive && (
                                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                                    {/*<div className="w-2 h-2 bg-slate-300 rounded-full"></div>*/}
                                                    {/*<span>Last updated 2 minutes ago</span>*/}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    {activeTab === 'objectives' && (
                                        <div className="p-6 pb-32 dark:text-gray-200 dark:bg-bodybg ">
                                            <div className="mb-8 ">
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-white transition-all duration-300 ${
                                                                isActive ? '' : 'opacity-60'
                                                            }`}
                                                            style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                                                            <Award className="w-6 h-6"/>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className={`text-2xl font-bold tracking-tight transition-colors duration-300 dark:text-gray-200 dark:bg-bodybg  ${
                                                            isActive ? 'text-slate-900' : 'text-slate-500'
                                                        }`}>
                                                            Key Result Areas & Performance Objectives
                                                        </h2>
                                                        <p className={`text-sm mt-2 leading-relaxed transition-colors duration-300 dark:text-gray-200 dark:bg-bodybg  ${
                                                            isActive ? 'text-slate-600' : 'text-slate-400'
                                                        }`}>
                                                            {isActive
                                                                ? 'Define your key performance indicators and measurable objectives that align with organizational goals.'
                                                                : 'Form is currently disabled. Please enable to continue.'
                                                            }
                                                        </p>

                                                        <div className="flex items-center space-x-6 mt-4 dark:text-gray-200 dark:bg-bodybg">
                                                            <div className="flex items-center space-x-2">
                                                                <div
                                                                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                                                        isActive ? 'bg-success' : 'bg-slate-300'
                                                                    }`}></div>
                                                                <span className={`text-xs transition-colors duration-300 ${
                                                                    isActive ? 'text-slate-500' : 'text-slate-400'
                                                                }`}>KRA Creation</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div
                                                                    className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                                                <span
                                                                    className={`text-xs transition-colors duration-300 ${
                                                                        isActive ? 'text-slate-500' : 'text-slate-400'
                                                                    }`}>Review & Approval</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div
                                                                    className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                                                <span className={`text-xs transition-colors duration-300 ${
                                                                    isActive ? 'text-slate-500' : 'text-slate-400'
                                                                }`}>Performance Tracking</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`space-y-6 overflow-y-auto max-h-[600px] pr-2 transition-all duration-300 dark:text-gray-200 dark:bg-bodybg ${
                                                isActive ? 'opacity-100' : 'opacity-30'
                                            }`}>
                                                {isActive && fields.map((field, index) => (
                                                    <ObjectiveCard
                                                        key={field.id}
                                                        objective={field}
                                                        index={index}
                                                        control={control}
                                                        errors={errors}
                                                        onRemove={() => remove(index)}
                                                        canRemove={fields.length > 1}
                                                    />
                                                ))}

                                                {!isActive && (
                                                    <div className="text-center py-12">
                                                        <div className="text-slate-400 text-lg font-medium">
                                                            Form is currently disabled
                                                        </div>
                                                        <div className="text-slate-300 text-sm mt-2">
                                                            Enable the form to view and edit objectives
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'history' && editMode && isActive && (
                                        <div className="pb-32">
                                            <ActionHistory actionHistory={[]}/>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isActive && (
                                <div
                                    className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-2xl">
                                    <div className="max-w-7xl mx-auto px-6 py-4">
                                        <div className="mb-4">
                                            <WeightageStatus totalWeightage={getTotalWeightage()}/>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-6">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                    <span className="text-sm text-slate-600 font-medium">
                                                        {fields.length} KRA{fields.length !== 1 ? 's' : ''} defined
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">

                                                <button
                                                    type="button"
                                                    onClick={handleSubmit(onSaveDraft)}
                                                    className="group flex items-center px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <div
                                                        className="flex items-center justify-center w-5 h-5 bg-slate-100 rounded-lg mr-2 group-hover:bg-slate-200 transition-all duration-200"
                                                    >
                                                        <Save
                                                            className={`w-3 h-3 ${isSavingDraft ? "animate-spin inline-block" : ""}`}
                                                        />
                                                    </div>
                                                    Save Draft
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={handleSubmit(handleActionClick)}
                                                    disabled={!isWeightageValid}
                                                    className={`
                                                        group flex items-center px-6 py-2.5 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl
                                                        ${isWeightageValid
                                                        ? 'text-white hover:scale-105'
                                                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                                    }
                                                    `}
                                                    style={isWeightageValid ? {
                                                        background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
                                                        '--hover-bg': 'linear-gradient(135deg, #059669 0%, #0f766e 100%)'
                                                    } : {}}
                                                    onMouseEnter={(e) => {
                                                        if (isWeightageValid) {
                                                            e.target.style.background = 'linear-gradient(135deg, #059669 0%, #0f766e 100%)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (isWeightageValid) {
                                                            e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)';
                                                        }
                                                    }}
                                                >
                                                    <div className={`
                                                        flex items-center justify-center w-5 h-5 rounded-lg mr-2 transition-all duration-200
                                                        ${isWeightageValid
                                                        ? 'bg-white/20 group-hover:bg-white/30'
                                                        : 'bg-slate-400'
                                                    }
                                                    `}>
                                                        <Target className="w-3 h-3"/>
                                                    </div>
                                                    {isWeightageValid ? 'Submit for Approval' : 'Complete All Fields : "animate-spin inline-block" : ""'}

                                                    {isWeightageValid && (
                                                        <div className="ml-2 flex items-center">
                                                            <svg
                                                                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="h-32"></div>
                        </div>
                    </div>
                </form>
            </div>

            {isActive && (
                <AlertModal
                    id="objective-submissions"
                    isOpen={isModalOpen}
                    type="success"
                    title="Confirm Action"
                    message="Are you sure you want to submit the objectives?"
                    btnTxt="Confirm"
                    isSubmitting={isSubmitting}
                    needInput={false}
                    onConfirm={onSubmitForApproval}
                    onClose={setIsModalOpen}
                />
            )}
        </>
    )
}

export default ObjectiveForm
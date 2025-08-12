import ProfileSidebar from "@modules/employee-self-services/objectives/components/ProfileSidebar.jsx";
import {Award, FileText, Plus, Save, Target} from "lucide-react";
import ObjectiveCard from "@modules/employee-self-services/objectives/components/ObjectiveCard.jsx";
import ActionHistory from "@modules/employee-self-services/objectives/components/ActionHistory.jsx";
import WeightageStatus from "@modules/employee-self-services/objectives/components/WeightageStatus.jsx";
import React, {useState} from "react";
import AlertModal from "@components/AlertModal.jsx";
import {useObjectiveForm} from "@modules/employee-self-services/objectives/hooks/useObjectiveForm.js";

const ObjectiveForm = ({year = null, editMode = false}) => {
    const [activeTab, setActiveTab] = useState(editMode ? "objectives" : "history ")

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
        onSaveDraft,
        isModalOpen,
        setIsModalOpen,
        isSubmitting,
    } = useObjectiveForm(year, editMode)

    return (
        <>
            <form>
                <div className="grid grid-cols-12 gap-x-6">
                    <ProfileSidebar
                        totalObjectives={fields.length}
                        totalWeightage={getTotalWeightage()}
                    />

                    <div className="xxl:col-span-8">
                        <div
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                            <div
                                className="bg-gradient-to-r from-slate-50 via-slate-50 to-white border-b border-slate-200/80">
                                <div className="flex items-center justify-between px-6 py-4">
                                    <div className="flex space-x-1 bg-slate-100/60 rounded-xl p-1">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("objectives")}
                                            className={`
                            relative flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap
                            ${activeTab === 'objectives'
                                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                            }
                        `}
                                        >

                                            <div className={`flex items-center justify-center w-5 h-5 rounded-md mr-2 transition-all duration-300
                                                ${activeTab === "objectives"
                                                ? "bg-blue-500 text-white"
                                                : "bg-slate-300 text-slate-600"
                                            }`}
                                                 style={activeTab === "objectives" ? {background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"} : {}}>
                                                <Award className="w-3 h-3"/>
                                            </div>
                                            KRA Objectives
                                            {activeTab === 'objectives' && (
                                                <div
                                                    className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                                    <div className="w-1 h-1 rounded-full"
                                                         style={{background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)'}}></div>
                                                </div>
                                            )}
                                        </button>

                                        {editMode && (<button
                                                type="button"
                                                onClick={() => setActiveTab("history")}
                                                className={`relative flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap
                                                ${activeTab === "history"
                                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50"
                                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                                                }`}
                                            >
                                                <div className={`flex items-center justify-center w-5 h-5 rounded-md mr-2 transition-all duration-300
                                                ${activeTab === "history"
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-slate-300 text-slate-600"
                                                }`}
                                                     style={activeTab === "history" ? {background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)"} : {}}>
                                                    <FileText className="w-3 h-3"/>
                                                </div>
                                                Action History
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        {activeTab === "objectives" && (
                                            <button
                                                type="button"
                                                onClick={append}
                                                className="group flex items-center px-4 py-2 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                                                style={{ background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" }}
                                            >
                                                <div
                                                    className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-lg mr-2 group-hover:bg-white/30 transition-all duration-200"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </div>
                                                Add KRA
                                            </button>
                                        )}
                                        {activeTab === "history" && (
                                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                                                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                                <span>Last updated 2 minutes ago</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {activeTab === "objectives" && (
                                    <div className="p-6 pb-32">
                                        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                                            {fields.map((field, index) => (
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
                                        </div>
                                    </div>
                                )}

                                {activeTab === "history" && (
                                    <div className="pb-32">
                                        <ActionHistory actionHistory={[]} />
                                    </div>
                                )}
                            </div>
                        </div>

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
                                                        className={`w-3 h-3 ${isSubmitting ? "animate-spin inline-block" : ""}`}/>
                                                </div>
                                                Save Draft
                                            </button>
                                        </div>


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
                                            <div
                                                className={` flex items-center justify-center w-5 h-5 rounded-lg mr-2 transition-all duration-200
                                                    ${isWeightageValid
                                                    ? 'bg-white/20 group-hover:bg-white/30'
                                                    : 'bg-slate-400'
                                                }
                                                   `}
                                            >
                                                <Target className={`w-3 h-3 ${isSubmitting ? "animate-spin inline-block" : ""}`} />
                                            </div>
                                            {isWeightageValid ? 'Submit for Approval' : 'Complete All Fields'}

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

                        <div className="h-32"></div>
                    </div>
                </div>
            </form>

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
        </>
    )
}

export default ObjectiveForm
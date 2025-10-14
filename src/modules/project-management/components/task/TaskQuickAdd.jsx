import React, {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import { taskStatuses, createTask } from "@modules/project-management/services/taskService.js";
import { priorities } from "@modules/project-management/services/projectService.js";
import { convertToDateTime, convertToDateTimeEnd } from "@helpers/dateTime.js";
import { dateTimeSchema } from "@helpers/schema.js";
import { prioritiesEnum } from "@modules/project-management/schemas/projectSchema.js";
import Notify from "@helpers/toastNotifications.js";

// Status enum - memoized outside component
const statusValues = taskStatuses.map((status) => status.value || status.key);
const statusEnum = z.enum(statusValues, {
    errorMap: () => `Status must be one of: ${statusValues.join(", ")}`,
});

// Schemas - defined outside component for performance
const quickAddSchema = z.object({
    name: z.string()
        .min(1, "Task name is required")
        .max(80, "Task name must be at most 80 characters long"),
    user_ids: z.array(z.number().int().positive())
        .min(1, "At least one user must be assigned"),
});

const taskSchema = z.object({
    name: z.string()
        .min(1, "Task name is required")
        .max(80, "Task name must be at most 80 characters long"),
    description: z.string()
        .max(1000, "Description must be at most 1000 characters long")
        .optional(),
    priority: prioritiesEnum.default("medium"),
    status: statusEnum.default("not_started"),
    started_at: dateTimeSchema('Started'),
    ended_at: dateTimeSchema('Ended'),
    team_ids: z.array(z.number().int().positive())
        .min(1, "At least one team is required"),
    user_ids: z.array(z.number().int().positive())
        .min(1, "At least one user must be assigned"),
    tag_ids: z.array(z.number().int().positive())
        .min(1, "At least one tag is required"),
}).refine(data => {
    if (data.ended_at) {
        return new Date(data.ended_at) >= new Date(data.started_at);
    }
    return true;
}, {
    message: "End date must be greater than or equal to start date",
    path: ["ended_at"],
});

// Helper function - moved outside component
const getUserInitials = (fullName) => {
    return fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const TaskQuickAdd = ({
                          milestoneId,
                          projectId,
                          startedAt,
                          endedAt,
                          projectUsers = [],
                          currentUser = null,
                          heightFilter,
                          onTaskCreated,
                          teams = [],
                          tags = [],
                      }) => {
    const [showExpandedForm, setShowExpandedForm] = useState(false);
    const [quickTaskName, setQuickTaskName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const quickInputRef = useRef(null);
    const userDropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Memoized formatted options
    const formattedOptions = useMemo(() => {
        const formattedTags = tags.map(tag => ({
            value: tag.id,
            label: tag.name,
        }));

        const formattedTeams = teams.map(team => ({
            value: team.id,
            label: team.name,
        }));

        const currentUserInProject = currentUser && projectUsers.find(user => user.id === currentUser.id);
        const formattedCurrentUser = currentUserInProject
            ? [{
                value: currentUser.id,
                label: `${currentUser.full_name} (${currentUser.email})`
            }]
            : [];

        return {
            tags: formattedTags,
            teams: formattedTeams,
            currentUser: formattedCurrentUser,
            tagIds: tags.map(tag => tag.id),
            teamIds: teams.map(team => team.id),
            userIds: formattedCurrentUser.length > 0 ? [currentUser.id] : [],
        };
    }, [tags, teams, currentUser, projectUsers]);

    // Memoized default values
    const defaultValues = useMemo(() => ({
        name: '',
        priority: 'medium',
        status: 'in_progress',
        user_ids: formattedOptions.userIds,
        tag_ids: formattedOptions.tagIds,
        team_ids: formattedOptions.teamIds,
        started_at: convertToDateTime(startedAt),
        ended_at: convertToDateTimeEnd(endedAt),
        description: '',
    }), [formattedOptions, startedAt, endedAt]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues,
    });

    // Initialize selected users
    useEffect(() => {
        if (currentUser && projectUsers.length > 0) {
            const userInProject = projectUsers.find(user => user.id === currentUser.id);
            if (userInProject) {
                setSelectedUsers([userInProject]);
            }
        }
    }, [currentUser, projectUsers]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
                setUserSearchQuery('');
                heightFilter?.(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [heightFilter]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (showUserDropdown && searchInputRef.current) {
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showUserDropdown]);

    // Memoized filtered users
    const filteredUsers = useMemo(() => {
        if (!userSearchQuery) return projectUsers;

        const searchLower = userSearchQuery.toLowerCase();
        return projectUsers.filter(user =>
            user.full_name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    }, [projectUsers, userSearchQuery]);

    // Callbacks
    const toggleUserSelection = useCallback((user) => {
        setSelectedUsers(prev => {
            const isSelected = prev.some(u => u.id === user.id);
            return isSelected
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user];
        });
    }, []);

    const removeUser = useCallback((userId) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    }, []);

    const handleUserDropdownToggle = useCallback(() => {
        setShowUserDropdown(prev => {
            const newState = !prev;
            heightFilter?.(newState);
            if (newState) {
                setUserSearchQuery('');
            }
            return newState;
        });
    }, [heightFilter]);

    const closeUserDropdown = useCallback(() => {
        setShowUserDropdown(false);
        heightFilter?.(false);
        setUserSearchQuery('');
    }, [heightFilter]);

    const handleQuickAdd = useCallback(async (e) => {
        if (e.key === 'Enter' && quickTaskName.trim()) {
            e.preventDefault();

            const quickData = {
                name: quickTaskName.trim(),
                user_ids: selectedUsers.map(u => u.id),
            };

            try {
                quickAddSchema.parse(quickData);
            } catch (validationError) {
                const errorMessage = validationError.errors?.[0]?.message || 'Validation failed';
                Notify.error(errorMessage);
                return;
            }

            const quickTaskData = {
                ...quickData,
                priority: 'medium',
                status: 'in_progress',
                tag_ids: formattedOptions.tagIds,
                team_ids: formattedOptions.teamIds,
                started_at: convertToDateTime(startedAt),
                ended_at: convertToDateTimeEnd(endedAt),
            };

            setIsSubmitting(true);
            try {
                await createTask(milestoneId, quickTaskData);
                setQuickTaskName('');

                // Reset to current user
                const currentUserInProject = currentUser && projectUsers.find(user => user.id === currentUser.id);
                setSelectedUsers(currentUserInProject ? [currentUserInProject] : []);

                onTaskCreated?.();
            } catch (error) {
                console.error('Error creating quick task:', error);
            } finally {
                setIsSubmitting(false);
            }
        } else if (e.key === 'Escape') {
            setQuickTaskName('');
            quickInputRef.current?.blur();
        }
    }, [quickTaskName, selectedUsers, formattedOptions, milestoneId, startedAt, endedAt, currentUser, projectUsers, onTaskCreated]);

    const onSubmit = useCallback(async (data) => {
        setIsSubmitting(true);
        try {
            await createTask(milestoneId, data);
            reset();
            setShowExpandedForm(false);
            onTaskCreated?.();
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [milestoneId, onTaskCreated, reset]);

    const toggleExpandedForm = useCallback(() => {
        setShowExpandedForm(prev => {
            if (!prev) setQuickTaskName('');
            return !prev;
        });
    }, []);

    const handleCancelExpanded = useCallback(() => {
        reset();
        setShowExpandedForm(false);
    }, [reset]);

    // Render user avatar component
    const UserAvatar = useCallback(({ user, size = 'w-8 h-8', textSize = 'text-xs' }) => (
        <div className={`${size} rounded-full bg-primary text-white ${textSize} font-semibold flex items-center justify-center flex-shrink-0`}>
            {user.avatar ? (
                <img
                    src={user.avatar.small_url}
                    alt={user.full_name}
                    className="w-full h-full rounded-full object-cover"
                />
            ) : (
                getUserInitials(user.full_name)
            )}
        </div>
    ), []);

    return (
        <div className="border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            {!showExpandedForm && (
                <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <button
                        onClick={toggleExpandedForm}
                        disabled={isSubmitting}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-info hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
                        title="Show more options"
                        aria-label="Show more options">
                        <i className="ri-arrow-right-s-line text-lg" />
                    </button>

                    <div className="flex-1 flex items-center gap-2">
                        <i className="ri-add-line text-success text-lg flex-shrink-0" />
                        <input
                            ref={quickInputRef}
                            type="text"
                            value={quickTaskName}
                            onChange={(e) => setQuickTaskName(e.target.value)}
                            onKeyDown={handleQuickAdd}
                            disabled={isSubmitting}
                            placeholder="Add task (press Enter to save, Esc to cancel)"
                            className="flex-1 px-2 py-1 text-sm border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
                        />
                    </div>

                    <div className="relative" ref={userDropdownRef}>
                        <button
                            type="button"
                            onClick={handleUserDropdownToggle}
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
                            title="Assign users"
                            aria-label="Assign users">
                            <i className="ri-user-line text-sm" />
                            {selectedUsers.length > 0 ? (
                                <div className="flex items-center gap-1.5">
                                    <div className="flex -space-x-1.5">
                                        {selectedUsers.slice(0, 2).map((user) => (
                                            <div
                                                key={user.id}
                                                className="w-5 h-5 rounded-full bg-primary text-white text-[9px] font-medium flex items-center justify-center border border-primary dark:border-neutral-800"
                                                title={user.full_name}>
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar.small_url}
                                                        alt={user.full_name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    getUserInitials(user.full_name)
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {selectedUsers.length > 2
                                            ? `${selectedUsers.length} users`
                                            : selectedUsers.map(u => u.full_name.split(' ')[0]).join(', ')}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-500">Assign</span>
                            )}
                            <i className={`ri-arrow-down-s-line text-sm transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showUserDropdown && (
                            <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                                <div className="p-3 border-b border-gray-200 dark:border-neutral-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Assign Users
                                        </span>
                                        {selectedUsers.length > 0 && (
                                            <button
                                                onClick={() => setSelectedUsers([])}
                                                className="text-xs text-gray-500 hover:text-danger transition-colors">
                                                Clear all
                                            </button>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={userSearchQuery}
                                            onChange={(e) => setUserSearchQuery(e.target.value)}
                                            placeholder="Search users..."
                                            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-info transition-all placeholder-gray-400"
                                        />
                                        {userSearchQuery && (
                                            <button
                                                onClick={() => setUserSearchQuery('')}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                aria-label="Clear search">
                                                <i className="ri-close-line" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {selectedUsers.length > 0 && (
                                    <div className="px-3 py-2 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedUsers.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                                                    <UserAvatar user={user} size="w-4 h-4" textSize="text-[8px]" />
                                                    <span className="font-medium">{user.full_name.split(' ')[0]}</span>
                                                    <button
                                                        onClick={() => removeUser(user.id)}
                                                        className="hover:bg-primary/20 rounded p-0.5 transition-colors"
                                                        aria-label={`Remove ${user.full_name}`}>
                                                        <i className="ri-close-line text-xs" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="overflow-y-auto max-h-64">
                                    {filteredUsers.length > 0 ? (
                                        <div className="py-1">
                                            {filteredUsers.map((user) => {
                                                const isSelected = selectedUsers.some(u => u.id === user.id);
                                                return (
                                                    <button
                                                        key={user.id}
                                                        onClick={() => toggleUserSelection(user)}
                                                        className={`w-full px-3 py-2 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors ${
                                                            isSelected ? 'bg-primary/10' : ''
                                                        }`}>
                                                        <UserAvatar user={user} />

                                                        <div className="flex-1 text-left min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {user.full_name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {user.email}
                                                            </div>
                                                        </div>

                                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                            isSelected
                                                                ? 'bg-primary border-primary'
                                                                : 'border-gray-300 dark:border-neutral-600'
                                                        }`}>
                                                            {isSelected && (
                                                                <i className="ri-check-line text-white text-xs" />
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="px-3 py-8 text-center">
                                            <i className="ri-user-search-line text-3xl text-gray-300 dark:text-neutral-700 mb-2" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {userSearchQuery ? 'No users found' : 'No users available'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 border-t border-gray-200 dark:border-neutral-700">
                                    <button
                                        onClick={closeUserDropdown}
                                        className="w-full px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg transition-colors">
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={toggleExpandedForm}
                        disabled={isSubmitting}
                        className="flex-shrink-0 px-3 py-1 text-xs text-primary hover:bg-primary/10 rounded transition-colors font-medium disabled:opacity-50"
                        title="More options">
                        <i className="ri-more-line mr-1" />
                        More Options
                    </button>
                </div>
            )}

            {showExpandedForm && (
                <div className="p-4 bg-primary-50/30 dark:bg-primary-900/10 border-t-2 border-primary">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12">
                                <FormInput
                                    name="name"
                                    control={control}
                                    errors={errors}
                                    placeholder="Task Name"
                                    className="font-medium"
                                    is_required={true}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <FormInput
                                    type="datetime-local"
                                    name="started_at"
                                    control={control}
                                    errors={errors}
                                    placeholder="Start Date"
                                    min={convertToDateTime(startedAt)}
                                    max={convertToDateTimeEnd(endedAt)}
                                    is_required={true}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <FormInput
                                    type="datetime-local"
                                    name="ended_at"
                                    control={control}
                                    errors={errors}
                                    placeholder="End Date"
                                    min={convertToDateTime(startedAt)}
                                    max={convertToDateTimeEnd(endedAt)}
                                    is_required={true}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <FormSelect
                                    name="priority"
                                    control={control}
                                    errors={errors}
                                    options={priorities}
                                    placeholder="Priority"
                                    is_required={true}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <FormSelect
                                    name="status"
                                    control={control}
                                    errors={errors}
                                    options={taskStatuses}
                                    placeholder="Status"
                                    is_required={true}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                <FormAsyncSelect
                                    isMulti={true}
                                    name="team_ids"
                                    control={control}
                                    errors={errors}
                                    placeholder="Teams"
                                    apiUrl="/select/pms/teams/"
                                    queryKeyBase="pms_teams"
                                    saveOptionEndpoint="/select/pms/team/"
                                    allowSaveNewOption={true}
                                    is_required={true}
                                    preselectedOptions={formattedOptions.teams}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                <FormAsyncSelect
                                    isMulti={true}
                                    clientSideSearch={true}
                                    name="user_ids"
                                    control={control}
                                    errors={errors}
                                    placeholder="Assigned To"
                                    apiUrl={`/select/project/${projectId}/users/`}
                                    queryKeyBase="project_users"
                                    is_required={true}
                                    preselectedOptions={formattedOptions.currentUser}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                <FormAsyncSelect
                                    isMulti={true}
                                    name="tag_ids"
                                    control={control}
                                    errors={errors}
                                    placeholder="Tags"
                                    apiUrl="/select/tags/"
                                    queryKeyBase="tags"
                                    saveOptionEndpoint="/select/tag/"
                                    allowSaveNewOption={true}
                                    is_required={true}
                                    preselectedOptions={formattedOptions.tags}
                                />
                            </div>

                            <div className="col-span-12">
                                <FormTextarea
                                    name="description"
                                    control={control}
                                    errors={errors}
                                    placeholder="Description (optional)"
                                    rows={3}
                                />
                            </div>

                            <div className="col-span-12 flex items-center justify-between gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={toggleExpandedForm}
                                    disabled={isSubmitting}
                                    className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 disabled:opacity-50">
                                    <i className="ri-arrow-up-s-line" />
                                    Collapse
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCancelExpanded}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800 rounded transition-colors disabled:opacity-50">
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm bg-primary text-white hover:bg-primary/90 rounded transition-colors font-medium flex items-center gap-1 disabled:opacity-50">
                                        {isSubmitting ? (
                                            <>
                                                <i className="ri-loader-4-line animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-check-line" />
                                                Create Task
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {!showExpandedForm && (
                <div className="px-4 py-2 text-xs border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
                    <div className="space-y-2">
                        <div className="text-gray-400 dark:text-gray-600 flex items-start gap-1.5">
                            <i className="ri-information-line text-sm mt-0.5 flex-shrink-0"/>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="flex-shrink-0">Quick add defaults:</span>
                                {startedAt && endedAt && (
                                    <span
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5">
                                        <i className="ri-calendar-line text-xs"/>
                                        {new Date(startedAt).toLocaleDateString()} - {new Date(endedAt).toLocaleDateString()}
                                    </span>
                                )}
                                {teams.length > 0 && (
                                    <span
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5">
                                        <i className="ri-team-line text-xs"/>
                                        {teams.length === 1 ? teams[0].name : `${teams.length} teams`}
                                    </span>
                                )}
                                {tags.length > 0 && (
                                    <span
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5">
                                        <i className="ri-price-tag-3-line text-xs"/>
                                        {tags.length === 1 ? tags[0].name : `${tags.length} tags`}
                                    </span>
                                )}
                                <span
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5">
                                    <i className="ri-flag-line text-xs"/>
                                    Medium priority
                                </span>
                                <span
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5">
                                    <i className="ri-loader-line text-xs"/>
                                    In Progress
                                </span>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-500">
                            <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded text-xs">Enter</kbd>
                            <span>Quick add</span>
                            <span className="mx-2">•</span>
                            <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded text-xs">Esc</kbd>
                            <span>Cancel</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskQuickAdd;
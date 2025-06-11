import React from 'react';
import moment from 'moment';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import api from "@config/axiosConfig.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Avatar from "@components/Avatar.jsx";

const ProjectActivityLog = ({ id, projectName }) => {
  const fetchActivityLogs = async ({ pageParam = 0 }) => {
    const response = await api.get(`pms/projects/${id}/activity-log/`, {
      params: { skip: pageParam, limit: 10 },
    });
    return response.data.data;
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['projectActivityLog', id],
    queryFn: fetchActivityLogs,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.current_page * 10;
      return lastPage.current_page < lastPage.total_pages ? nextSkip : undefined;
    },
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getActionIcon = (actionType) => {
    const icons = {
      created: 'ri-add-circle-line',
      updated: 'ri-edit-line',
      deleted: 'ri-delete-bin-line',
      tag_added: 'ri-price-tag-3-line',
      tag_removed: 'ri-price-tag-3-line',
      team_added: 'ri-team-line',
      team_removed: 'ri-team-line',
      member_added: 'ri-user-add-line',
      member_removed: 'ri-user-unfollow-line',
      attachment_added: 'ri-attachment-line',
      attachment_removed: 'ri-attachment-line',
      user_assigned: 'ri-user-settings-line',
      user_unassigned: 'ri-user-settings-line',
      dates_changed: 'ri-calendar-event-line',
    };
    return icons[actionType] || 'ri-information-line text-gray-600';
  };

  const getActionColor = (actionType) => {
    const colors = {
      created: 'bg-success/10 bg-outline-success',
      updated: 'bg-primary/10 bg-outline-primary',
      deleted: 'bg-danger/10 bg-outline-danger',
      tag_added: 'bg-info/10 bg-outline-info',
      tag_removed: 'bg-warning/10 bg-outline-warning',
      team_added: 'bg-info/10 bg-outline-info',
      team_removed: 'bg-info/10 bg-outline-info',
      member_added: 'bg-info/10 bg-outline-info',
      member_removed: 'bg-warning/10 bg-outline-warning',
      attachment_added: 'bg-info/10 bg-outline-info',
      attachment_removed: 'bg-warning/10 bg-outline-warning',
      user_assigned: 'bg-info/10 bg-outline-info',
      user_unassigned: 'bg-warning/10 bg-outline-warning',
      dates_changed: 'bg-info/10 bg-outline-info',
    };
    return colors[actionType] || 'bg-info/10 bg-outline-info';
  };

  const getContextName = (log) => {
    if (log.task?.name) return log.task.name;
    if (log.milestone?.name) return log.milestone.name;
    return projectName;
  };

  const getContextType = (log) => {
    if (log.task) return 'Task';
    if (log.milestone) return 'Milestone';
    return 'Project';
  };

  const formatActionMessage = (log) => {
    const { action_type, message } = log;
    const contextName = getContextName(log);
    const contextType = getContextType(log);
    const quotedText = message.match(/['"]([^'"]+)['"]/)?.[1] || '';

    switch(action_type) {
      case 'created':
        return {
          action: `Created ${contextType.toLowerCase()}`,
          target: contextName,
          details: null
        };

      case 'updated':
        const updateDetails = message.replace(/['"][^'"]+['"]/, '').trim();
        return {
          action: `Updated ${contextType.toLowerCase()}`,
          target: contextName,
          details: updateDetails
        };

      case 'tag_added':
        return {
          action: 'Added tag',
          target: contextName,
          details: `Tag: ${quotedText}`
        };

      case 'team_added':
        return {
          action: 'Added team',
          target: contextName,
          details: `Team: ${quotedText}`
        };

      case 'member_added':
        return {
          action: 'Added member',
          target: contextName,
          details: `Member: ${quotedText}`
        };

      case 'member_removed':
        return {
          action: 'Removed member',
          target: contextName,
          details: `Member: ${quotedText}`
        };

      case 'attachment_added':
        return {
          action: 'Added attachment',
          target: contextName,
          details: `File: ${quotedText}`
        };

      case 'user_assigned':
        return {
          action: 'Assigned user',
          target: contextName,
          details: `Assignee: ${quotedText}`
        };

      case 'dates_changed':
        return {
          action: 'Updated dates',
          target: contextName,
          details: message.replace(/['"][^'"]+['"]/, '').trim()
        };

      case 'commented':
        return {
          action: 'Added comment',
          target: contextName,
          details: null
        };

      default:
        return {
          action: 'Updated',
          target: contextName,
          details: message
        };
    }
  };

  const renderLogItem = (log) => {
    const { action_type, created_by, created_at } = log;
    const userName = created_by?.full_name || 'System';
    const actionIcon = getActionIcon(action_type);
    const actionColor = getActionColor(action_type);
    const contextType = getContextType(log);
    const messageData = formatActionMessage(log);

    return (
        <div key={`${log.id || created_at}`} className={`!border-l-4 ${actionColor} rounded-r-lg mb-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-600">
                  <i className={`${actionIcon} text-sm`}></i>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Avatar
                      avatar={created_by?.avatar}
                      size="xs"
                      full_name={userName}
                      parentClasses="flex-shrink-0"
                  />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {userName}
                </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {messageData.action}
                </span>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center badge !rounded-full bg-black text-white">
                  {contextType}
                </span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {messageData.target}
                </span>
                </div>

                {messageData.details && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {messageData.details}
                      </p>
                    </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <time className="text-xs text-gray-500 dark:text-gray-400">
                    {moment(created_at).format('MMM D, YYYY [at] h:mm A')}
                  </time>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                  {moment(created_at).fromNow()}
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };

  if (isLoading) {
    return (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
    );
  }

  if (isError) {
    return (
        <div className="text-center py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <i className="ri-error-warning-line text-red-600 text-2xl mb-2 block"></i>
            <h3 className="text-lg font-medium text-red-900 dark:text-red-200 mb-1">
              Unable to load activity
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm">
              {error.message}
            </p>
          </div>
        </div>
    );
  }

  if (!data || data.pages.every((page) => !page.rows || page.rows.length === 0)) {
    return (
        <div className="text-center py-12">
          <div className="max-w-sm mx-auto">
            <i className="ri-history-line text-gray-400 text-4xl mb-4 block"></i>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No activity yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Activity will appear here as team members work on this project.
            </p>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <i className="ri-history-line text-gray-600 dark:text-gray-400 text-xl"></i>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Activity
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
              Recent project updates
            </span>
            </div>
          </div>

          {/* Activity List */}
          <div className="p-6">
            <div className="space-y-4">
              {data.pages.map((page, pageIndex) =>
                  page.rows.map((log) => renderLogItem(log))
              )}
            </div>

            {/* Load More */}
            {hasNextPage && (
                <div
                    className="text-center py-6 border-t border-gray-200 dark:border-gray-700 mt-6"
                    ref={sentinelRef}
                >
                  {isFetchingNextPage ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading more activity...
                  </span>
                      </div>
                  ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Scroll to load more activity
                      </p>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ProjectActivityLog;
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
      status_changed: 'ri-checkbox-circle-line',
      priority_changed: 'ri-flag-line',
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
      team_removed: 'bg-warning/10 bg-outline-info',
      member_added: 'bg-info/10 bg-outline-info',
      member_removed: 'bg-warning/10 bg-outline-warning',
      attachment_added: 'bg-info/10 bg-outline-info',
      attachment_removed: 'bg-warning/10 bg-outline-warning',
      user_assigned: 'bg-info/10 bg-outline-info',
      user_unassigned: 'bg-warning/10 bg-outline-warning',
      dates_changed: 'bg-warning/10 bg-outline-warning',
      status_changed: 'bg-warning/10 bg-outline-warning',
      priority_changed: 'bg-warning/10 bg-outline-warning',
    };
    return colors[actionType] || 'text-gray-500 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300';
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
    const parts = message.split(/(['"][^'"]+['"])/);
    const boldText = parts
        .map(part => {
          if (/^['"].*['"]$/.test(part)) {
            return `<strong>${part.slice(1, -1)}</strong>`;
          }
          return part;
        })
        .join('');

    switch(action_type) {
      case 'created':
        return {
          action: `Created ${contextType.toLowerCase()}`,
          target: contextName,
          details: null
        };

      case 'deleted':
        return {
          action: `Deleted ${contextType.toLowerCase()}`,
          target: contextName,
          details: null
        };

      case 'updated':
        return {
          action: `Updated ${contextType.toLowerCase()}`,
          target: contextName,
          details: boldText
        };

      case 'tag_added':
        return {
          action: 'Added tag',
          target: contextName,
          details: `Tag: ${quotedText}`
        };

      case 'status_changed':
        return {
          action: 'Status changed',
          target: contextName,
          details: boldText
        };

      case 'priority_changed':
        return {
          action: 'Priority changed',
          target: contextName,
          details: boldText
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
          details: `<div class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                            <span class="badge bg-success text-white me-2">File</span>
                            <span class="text-[0.6875rem]"> ${quotedText}</span>
                    </div>`
        };

      case 'attachment_removed':
        return {
          action: 'Attachment removed',
          target: contextName,
          details: `<div class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                           <span class="badge bg-success text-white me-2">File</span>
                           <span class="text-[0.6875rem]"> ${quotedText}</span>
                    </div>`
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
          details: boldText
        };

      default:
        return {
          action: 'Updated',
          target: contextName,
          details: boldText
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
        <React.Fragment key={`${log.id || created_at}`}>
          <li>
            <div className="timeline-time text-end">
              <span className="date">{moment(created_at).format('dddd').toUpperCase()}</span>
              <span className="time inline-block">{moment(created_at).format('HH:mm')}</span>
            </div>
            <div className="timeline-icon" style={{insetInlineStart: '15.9%'}}>
              <Avatar
                  avatar={created_by?.avatar}
                  size="xs"
                  full_name={userName}
                  classes='rounded-full shadow-lg'
                  parentClasses="rounded-full -start-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900"
              />
            </div>
            <div className={`timeline-body rounded-lg shadow-xs`}>
                <div className="items-center justify-between mb-3 sm:flex">
                  <time className="mb-1 text-xs font-normal text-gray-500 sm:order-last sm:mb-0">{moment(created_at).fromNow()}</time>
                  <h3 className="flex items-center mb-1 text-lg text-gray-900 dark:text-white">
                    <span style={{fontFamily: 'cursive'}}>
                      {messageData.target}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs me-2 px-2.5 rounded-sm dark:bg-gray-700 dark:text-gray-400 border border-gray-500 ml-4 border-dashed font-normal">{contextType}</span>
                  </h3>
                </div>
              <div style={{fontFamily: 'cursive'}}
                   className={`p-3 text-xs italic font-normal border border-gray-200 rounded-lg  ${actionColor}`}>
                <div className="font-semibold text-gray-900 mb-2">#{userName}
                  <i className="ti ti-chevrons-right flex-shrink-0 text-[#8c9097] dark:text-white/50 px-[0.5rem] overflow-visible rtl:rotate-180"></i>
                  <span className='font-normal'><i className={`mr-1 ${actionIcon}`}></i>{messageData.action}</span>
                </div>
                <div dangerouslySetInnerHTML={{__html: messageData.details}}/>
              </div>
            </div>
          </li>
        </React.Fragment>
    );
  };

  if (isLoading) {
    return (
        <div className="flex justify-center py-8">
          <LoadingSpinner/>
        </div>
    );
  }

  if (isError) {
    return (
        <div className="text-center py-8">
          <div
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
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
          <>
            <div className="container">
            <ul className="timeline list-none text-[0.813rem] text-defaulttextcolor mb-10">
              {data.pages.map((page) =>
                  page.rows.map((log) => renderLogItem(log))
              )}
            </ul>
          </div>

            {hasNextPage && (
                <div
                    className="text-center py-6 border-t border-gray-200 dark:border-gray-700 mt-6"
                    ref={sentinelRef}
                >
                  {isFetchingNextPage ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner/>
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
          </>
)
  ;
};

export default ProjectActivityLog;
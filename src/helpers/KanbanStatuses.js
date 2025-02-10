export const taskBorderStyles = {
    open: 'border-t-[3px] border-solid border-primary/30',
    not_started: 'border-t-[3px] border-solid border-secondary/30',
    in_progress: 'border-t-[3px] border-solid border-info/30',
    half_completed: 'border-t-[3px] border-solid border-warning/30',
    near_completion: 'border-t-[3px] border-solid border-warning/30',
    completed: 'border-t-[3px] border-solid border-success/30',
    reopened: 'border-t-[3px] border-solid border-primary/30',
    on_hold: 'border-t-[3px] border-solid border-danger/30',
    cancelled: 'border-t-[3px] border-solid border-danger/30',
    rejected: 'border-t-[3px] border-solid border-danger/30',
    under_approval: 'border-t-[3px] border-solid border-info/30',
};

export const getTaskBorderClass = (status) => {
    if (!status) return ''; // Return an empty string if no status is provided
    const normalizedStatus = status.toLowerCase();
    return taskBorderStyles[normalizedStatus] || 'border-t-[3px] border-solid border-gray/30';
};

const txtSuccess = 'text-success';
const txtDanger = 'text-danger';
const txtSecondary = 'text-secondary';
const txtPrimary = 'text-primary';
const txtWarning = 'text-warning';
const success = 'bg-green/10 text-success';
const primary = 'bg-primary/10 text-primary';
const secondary = 'bg-secondary/10 text-secondary';
const info = 'bg-info/10 text-info';
const warning = 'bg-warning/10 text-warning';
const danger = 'bg-danger/10 text-danger';
const notFound = 'bg-gray/10 text-black';


const badgeStyles = {
    canceled: danger,
    low: success,
    completed: success,
    medium: secondary,
    high: danger,
    archived: danger,
    active: success,
    not_registered: info,
    suspended: warning,
    deactivated: danger,
    pending: warning,
    inactive: danger,
    brand_new: success,
    faulty: danger,
    functional: secondary,
    lost: warning,
    sold_to_employee: success,
    write_off: danger,
    completion: success,
    overdue: danger,
    in_progress: secondary,
    reopened: danger,
    near_completion: warning,
    under_approval: secondary,
    half_completed: success,
    open: info,
    not_started: info,
    on_hold: warning,
};

const statusStyles = {
    in_progress: txtSecondary,
    reopened: txtDanger,
    near_completion: txtWarning,
    under_approval: txtSecondary,
    half_completed: txtPrimary,
    open: txtSecondary,
    not_started: txtSecondary,
    on_hold: txtDanger,
    completed: txtSuccess,
    canceled: txtDanger,
    active: txtSuccess,
    archived: txtWarning,
    pending: warning,
    inactive: txtDanger,
    brand_new: txtSuccess,
    faulty: txtDanger,
    functional: txtSecondary,
    lost: warning,
    sold_to_employee: txtSuccess,
    write_off: txtDanger,
    High: txtDanger,
    Low: txtSuccess,
    Medium: txtWarning,

};

export const getBadgeClasses = (text, classes, badge = true) => {
    if (!text) return '';
    const normalizedText = text.toLowerCase();
    const style = badgeStyles[normalizedText] || notFound;
    return `${badge ? 'badge' : ''} ${classes} ${style}`.trim();
};

export const getStatusClasses = (text) => {
    if (!text) return '';
    const normalizedText = text.toLowerCase();
    const style = statusStyles[normalizedText] || notFound;
    return `  ${style}`.trim();
}



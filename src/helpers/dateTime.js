const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;
const WORKING_HOURS_PER_DAY = 8; // 8-hour workday


const isWeekend = (date) => date.getDay() === 6 || date.getDay() === 0;

export const formatDate = (dateString, format = 'MMM dd, yyyy') => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '';

    const options = {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    };
    const time = date.toTimeString().slice(0, 5); // Get time in HH:mm format

    switch (format) {
        case 'MMM dd, yyyy - HH:mm':
            return `${new Intl.DateTimeFormat('en-US', options).format(date)} - ${time}`;

        case 'dd, MMM yyyy - HH:mm':
            return `${new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(date).split(',')[0]} - ${time}`;

        case 'MMM dd, yyyy':
            return new Intl.DateTimeFormat('en-US', options).format(date);

        case 'MM/dd/yyyy':
            return new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(date);

        case 'yyyy-MM-dd':
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

        case 'full':
            return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);

        case 'time':
            return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);

        default:
            return new Intl.DateTimeFormat('en-US', options).format(date);
    }
};


// Function to calculate the total effort (hours, minutes, seconds) between two dates excluding weekends
export const calculateEffort = (startedAt, endedAt) => {
    let totalEffortMs = 0;
    let currentDate = new Date(startedAt);
    const endDate = new Date(endedAt);

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();

        // If the current day is a weekday (Monday to Friday)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // For the first and last day, only count the partial work hours
            let startOfDay = new Date(currentDate);
            startOfDay.setHours(9, 0, 0, 0); // Start work at 9:00 AM

            let endOfDay = new Date(currentDate);
            endOfDay.setHours(17, 0, 0, 0); // End work at 5:00 PM

            if (currentDate.toDateString() === new Date(startedAt).toDateString()) {
                // If it's the start date, count hours from the actual start time
                totalEffortMs += Math.min(endOfDay - currentDate, endOfDay - startOfDay);
            } else if (currentDate.toDateString() === endDate.toDateString()) {
                // If it's the end date, count hours up to the actual end time
                totalEffortMs += Math.min(endDate - startOfDay, endOfDay - startOfDay);
            } else {
                // Otherwise, count the full 8-hour workday
                totalEffortMs += WORKING_HOURS_PER_DAY * MS_IN_HOUR;
            }
        }

        // Move to the next day (skip the weekend directly)
        currentDate = new Date(currentDate.getTime() + MS_IN_DAY);
        if (isWeekend(currentDate)) {
            currentDate = new Date(currentDate.getTime() + (MS_IN_DAY * (7 - currentDate.getDay()))); // Jump to Monday
        }
    }

    // Convert total effort from milliseconds to hours, minutes, and seconds
    const hours = Math.floor(totalEffortMs / MS_IN_HOUR);
    const minutes = Math.floor((totalEffortMs % MS_IN_HOUR) / MS_IN_MINUTE);
    const seconds = Math.floor((totalEffortMs % MS_IN_MINUTE) / MS_IN_SECOND);

    // Return the formatted result as "00H : 00M : 00S"
    return `${hours.toString().padStart(2, '0')}H : ${minutes.toString().padStart(2, '0')}M : ${seconds.toString().padStart(2, '0')}S`;
};


export const formatDateTimeLocal = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
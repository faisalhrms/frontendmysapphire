const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;
const WORKING_HOURS_PER_DAY = 8; // 8-hour workday


const isWeekend = (date) => date.getDay() === 6 || date.getDay() === 0;

export const formatDate = (dateString, format = 'MMM dd, yyyy') => {
    if (!dateString){
        return '';
    }
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

export const convertToDateTime = (date, local = true) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (local){
        const localISOString = new Date(d).toLocaleString('sv-SE');
        return localISOString.slice(0, 16);
    }
    return d.toISOString().slice(0, 16);
};

export const convertToDateTimeEnd = (date, local = true) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    if (local){
        const localISOString = new Date(d).toLocaleString('sv-SE');
        return localISOString.slice(0, 16);
    }
    return d.toISOString().slice(0, 16);
};


export const getPastDate = (days = 1) => {
    const today = new Date();
    today.setDate(today.getDate() - days);
    return today.toISOString().slice(0, 10);
};

export const getPastDateTime = (days = 0) => {
    const today = new Date();
    today.setDate(today.getDate() - days);

    const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0, 0, 0, 0
    );

    return {
        startOfToday: startOfToday.toISOString(),
        now: today.toISOString()
    };
};
export const formatToDayMonthYear = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};


export const getDateRangeFromTimePeriod = (timePeriod) => {
    const today = new Date();
    let startDate, endDate;

    const getFiscalYearStart = (date) => new Date(date.getFullYear() - (date.getMonth() < 6 ? 1 : 0), 6, 1);
    const getFiscalQuarterStart = (date) => {
        const month = date.getMonth();
        let fiscalQuarterStartMonth;
        if (month >= 6 && month <= 8) fiscalQuarterStartMonth = 6;
        else if (month >= 9 && month <= 11) fiscalQuarterStartMonth = 9;
        else if (month >= 0 && month <= 2) fiscalQuarterStartMonth = 0;
        else fiscalQuarterStartMonth = 3;
        const fiscalYear = month < 6 ? date.getFullYear() - 1 : date.getFullYear();
        return new Date(fiscalYear, fiscalQuarterStartMonth, 1);
    };

    switch (timePeriod) {
        // Day
        case 'today':
            startDate = endDate = today;
            break;
        case 'yesterday':
            startDate = endDate = new Date(today.setDate(today.getDate() - 1));
            break;
        case 'tomorrow':
            startDate = endDate = new Date(today.setDate(today.getDate() + 1));
            break;

        // Week
        case 'this_week':
            startDate = new Date(today.setDate(today.getDate() - today.getDay()));
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;
        case 'previous_week':
            startDate = new Date(today.setDate(today.getDate() - today.getDay() - 7));
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;
        case 'next_week':
            startDate = new Date(today.setDate(today.getDate() + (7 - today.getDay())));
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;
        case 'previous_two_weeks':
            startDate = new Date(today.setDate(today.getDate() - today.getDay() - 14));
            endDate = new Date(today.setDate(today.getDate() - today.getDay() - 1));
            break;
        case 'next_two_weeks':
            startDate = new Date(today.setDate(today.getDate() + (7 - today.getDay())));
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 13);
            break;

        // Month
        case 'this_month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'previous_month':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'next_month':
            startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
            break;
        case 'previous_two_months':
            startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'next_two_months':
            startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
            break;

        // Quarter
        case 'this_quarter':
            const qStartMonth = Math.floor(today.getMonth() / 3) * 3;
            startDate = new Date(today.getFullYear(), qStartMonth, 1);
            endDate = new Date(today.getFullYear(), qStartMonth + 3, 0);
            break;
        case 'previous_quarter':
            const pStartMonth = Math.floor((today.getMonth() - 3) / 3) * 3;
            const pYear = today.getMonth() < 3 ? today.getFullYear() - 1 : today.getFullYear();
            startDate = new Date(pYear, pStartMonth, 1);
            endDate = new Date(pYear, pStartMonth + 3, 0);
            break;
        case 'next_quarter':
            const nStartMonth = Math.floor((today.getMonth() + 3) / 3) * 3;
            const nYear = nStartMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();
            startDate = new Date(nYear, nStartMonth % 12, 1);
            endDate = new Date(nYear, (nStartMonth % 12) + 3, 0);
            break;

        // Year
        case 'this_year':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31);
            break;
        case 'previous_year':
            startDate = new Date(today.getFullYear() - 1, 0, 1);
            endDate = new Date(today.getFullYear() - 1, 11, 31);
            break;
        case 'next_year':
            startDate = new Date(today.getFullYear() + 1, 0, 1);
            endDate = new Date(today.getFullYear() + 1, 11, 31);
            break;

        // Fiscal
        case 'current_fiscal_year':
            startDate = getFiscalYearStart(today);
            endDate = new Date(startDate.getFullYear() + 1, 6, 0);
            break;
        case 'previous_fiscal_year':
            startDate = getFiscalYearStart(new Date(today.getFullYear() - 1, 6, 1));
            endDate = new Date(startDate.getFullYear() + 1, 6, 0);
            break;
        case 'current_fiscal_quarter':
            startDate = getFiscalQuarterStart(today);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
            break;
        case 'previous_fiscal_quarter':
            startDate = getFiscalQuarterStart(new Date(today.setMonth(today.getMonth() - 3)));
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
            break;

        // Rolling
        case 'last_7_days':
            startDate = new Date(today.setDate(today.getDate() - 6));
            endDate = new Date();
            break;
        case 'last_30_days':
            startDate = new Date(today.setDate(today.getDate() - 29));
            endDate = new Date();
            break;
        case 'last_90_days':
            startDate = new Date(today.setDate(today.getDate() - 89));
            endDate = new Date();
            break;
        case 'last_365_days':
            startDate = new Date(today.setDate(today.getDate() - 364));
            endDate = new Date();
            break;
        case 'next_7_days':
            startDate = new Date();
            endDate = new Date(today.setDate(today.getDate() + 6));
            break;
        case 'next_30_days':
            startDate = new Date();
            endDate = new Date(today.setDate(today.getDate() + 29));
            break;

        // To Date options
        case 'mtd':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date();
            break;
        case 'qtd':
            const qtdStartMonth = Math.floor(today.getMonth() / 3) * 3;
            startDate = new Date(today.getFullYear(), qtdStartMonth, 1);
            endDate = new Date();
            break;
        case 'ytd':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date();
            break;
        case 'fytd':
            startDate = getFiscalYearStart(today);
            endDate = new Date();
            break;

        default:
            return null;
    }

    return {
        start: startDate.toISOString(),
        end: endDate.toISOString()
    };
};

export const secToHrs = (sec) => {
    const s = Number(sec || 0);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
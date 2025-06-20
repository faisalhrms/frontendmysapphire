export const loadFromLocalStorage = (rootKey = 'pms', key, defaultValue) => {
    const rootData = JSON.parse(localStorage.getItem(rootKey)) || {};
    return rootData[key] !== undefined ? rootData[key] : defaultValue;
};

export const saveToLocalStorage = (rootKey = 'pms', key, value) => {
    const rootData = JSON.parse(localStorage.getItem(rootKey)) || {};
    rootData[key] = value;
    localStorage.setItem(rootKey, JSON.stringify(rootData));
};

export const getBrowserMetadata = () => {
    return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        referrer: document.referrer || null,
    };
};

export const getMarketingMetadata = () => {
    const params = new URLSearchParams(window.location.search);

    const source = params.get("utm_source") || "";
    const medium = params.get("utm_medium") || "";
    const campaign = params.get("utm_campaign") || "";
    const term = params.get("utm_term") || "";
    const content = params.get("utm_content") || "";
    const referrer = document.referrer || "";
    const language = navigator.language || "";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    const summary = [
        source && `Source: ${source}`,
        medium && `Medium: ${medium}`,
        campaign && `Campaign: ${campaign}`,
        term && `Term: ${term}`,
        content && `Content: ${content}`,
        referrer && `Referrer: ${referrer}`,
        language && `Lang: ${language}`,
        timezone && `TZ: ${timezone}`
    ]
        .filter(Boolean)
        .join(" | ");

    return {
        source,
        medium,
        campaign,
        term,
        content,
        referrer,
        language,
        timezone,
        summary,
    };
};

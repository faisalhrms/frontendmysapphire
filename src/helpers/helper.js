export const loadFromLocalStorage = (rootKey = 'pms', key, defaultValue) => {
    const rootData = JSON.parse(localStorage.getItem(rootKey)) || {};
    return rootData[key] !== undefined ? rootData[key] : defaultValue;
};

export const saveToLocalStorage = (rootKey = 'pms', key, value) => {
    const rootData = JSON.parse(localStorage.getItem(rootKey)) || {};
    rootData[key] = value;
    localStorage.setItem(rootKey, JSON.stringify(rootData));
};
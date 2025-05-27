export const formatOptions = (data, key, valueKey = 'id', labelKey = 'name') => {
    if (!data || !data[key]) return [];

    const item = data[key];
    if (Array.isArray(item)) {
        return item.map(item => ({
            value: item[valueKey],
            label: item[labelKey],
        }));
    }

    return [{
        value: item[valueKey],
        label: item[labelKey],
    }];
};

export const formatOptionsWithConcatenation = (data, key, valueKey = 'id', labelKeys = ['name']) => {
    if (!data || !data[key]) return [];

    const item = data[key];
    if (Array.isArray(item)) {
        return item.map(item => ({
            value: item[valueKey],
            label: labelKeys
                .map((labelKey, index) =>
                    index === 1 ? `(${item[labelKey]})` : item[labelKey]
                )
                .filter(value => value)
                .join(' '),
        }));
    }

    return [{
        value: item[valueKey],
        label: labelKeys
            .map((labelKey, index) =>
                index === 1 ? `(${item[labelKey]})` : item[labelKey]
            )
            .filter(value => value)
            .join(' '),
    }];
};

export const formatAmountWithCommas = (amount) => {
    if (typeof amount !== 'number' && isNaN(Number(amount))) return amount;
    return Number(amount).toLocaleString('en-US');
};

export const getExcerptFromText = (string, length = 20, more = "...") => {
    // Remove HTML tags
    string = string.replace(/<\/?[^>]+(>|$)/g, "");
    // Split at spaces, hyphens, or underscores
    const words = string.split(/\s+|[-_]+/);

    if (words.length > 0) {
        let excerpt = '';
        let count = 0;

        for (const word of words) {
            count += word.length;
            if (count > length) {
                excerpt += more;
                break;
            }
            excerpt += ' ' + word;
        }

        return excerpt.trim();
    }

    return "";
}

export const toTitleCase = (str) => {
    if (!str) return '';
    return str
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const generateSidebarItem = (path = '', type = '', title = '', position = 0, icon = '', permission = '', children = []) => {
    return {
        icon,
        path,
        type,
        title,
        active: false,
        selected: false,
        dirchange: false,
        position,
        permission,
        children,
    };
};


export const formatMappedData = (
    data,                  // The array of data to be mapped
    referenceData,         // The reference data array to match with
    keyToMatch = 'user_id', // The key in `data` that corresponds to the key in `referenceData`
    referenceKey = 'id',   // The key in `referenceData` to match with `keyToMatch`
    labelKeys = ['full_name', 'email'],  // Keys in `referenceData` to format the label
    formatFn = (item, label) => label   // Optional formatting function to further format the label
) => {
    if (!data || !referenceData) return [];

    const referenceMap = referenceData.reduce((map, item) => {
        map[item[referenceKey]] = item;
        return map;
    }, {});

    return data.map(item => {
        const referenceItem = referenceMap[item[keyToMatch]];

        if (referenceItem) {
            const label = labelKeys
                .map((labelKey, index) =>
                    index === 1 ? `(${referenceItem[labelKey]})` : referenceItem[labelKey]
                )
                .join(' ');

            return {
                value: referenceItem[referenceKey],
                label: formatFn(referenceItem, label),
            };
        }
        return null;
    }).filter(option => option !== null);
};

export function formatNumberWithCommas(number) {
    return new Intl.NumberFormat().format(number);
}

export function formatLabel(label) {
    if (!label || label.toLowerCase() === 'total') return null;
    return label.toLowerCase().replace(/\s+/g, '_');
}

export function getPositiveNegativeColor(value){
    if (value === null || value === undefined) return;

    if (typeof value === 'string') {
        const cleaned = value.replace(/,/g, '').trim();
        if (cleaned === '' || cleaned === '-' || isNaN(Number(cleaned))) {
            return;
        }
        value = Number(cleaned);
    }

    return value < 0 ? 'text-red' : 'text-emerald-600';
}

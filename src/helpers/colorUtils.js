// helpers/colorUtils.js
export const generateColorPalette = (count) => {
    const palette = [
        "#845adf", "#23b7e5", "#f5b849", "#49b6f5", "#e6533c",
        "#26bf94", "#5b67c7", "#a65e76", "#eb4034", "#30bfbf"
    ];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

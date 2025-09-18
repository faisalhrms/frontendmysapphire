import React from 'react';
import { Pipette } from 'lucide-react';

const EyePatternsUI = ({
                           externalColor,
                           setExternalColor,
                           internalColor,
                           setInternalColor,
                           externalGradient,
                           setExternalGradient,
                           internalGradient,
                           setInternalGradient,
                           selectedExternal,
                           setSelectedExternal,
                           selectedInternal,
                           setSelectedInternal,
                       }) => {
    const externalPatterns = [
        { id: 'x', component: () => (
                <svg className="w-full h-full" viewBox="0 0 40 40">
                    <line x1="8" y1="8" x2="32" y2="32" stroke="currentColor" strokeWidth="2"/>
                    <line x1="32" y1="8" x2="8" y2="32" stroke="currentColor" strokeWidth="2"/>
                </svg>
            )},
        { id: 'square-outline', component: () => (
                <div className="w-6 h-6 border-2 border-current"></div>
            )},
        { id: 'rounded-square-outline', component: () => (
                <div className="w-6 h-6 border-2 border-current rounded-md"></div>
            )},
        { id: 'rounded-square-outline-2', component: () => (
                <div className="w-6 h-6 border-2 border-current rounded-lg"></div>
            )},
        { id: 'rounded-square-filled', component: () => (
                <div className="w-6 h-6 bg-current rounded-md"></div>
            )},
        { id: 'rounded-square-partial', component: () => (
                <div className="w-6 h-6 relative">
                    <div className="w-full h-full border-2 border-current rounded-md"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 bg-current rounded-tr-md"></div>
                </div>
            )},
        { id: 'circle-outline', component: () => (
                <div className="w-6 h-6 border-2 border-current rounded-full"></div>
            )},
        { id: 'circle-partial', component: () => (
                <div className="w-6 h-6 relative">
                    <div className="w-full h-full border-2 border-current rounded-full"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 bg-current rounded-full"></div>
                </div>
            )},
        { id: 'circle-filled', component: () => (
                <div className="w-6 h-6 bg-current rounded-full"></div>
            )},
        { id: 'gear', component: () => (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L18.5 5.5C18.5 5.5 18 5 18 4.5S18.5 3.5 18.5 3.5L21 2V4H23V2L20.5 0.5C20 0 19 0 18.5 0.5L16 2V4L18.5 5.5C19 6 19 7 18.5 7.5L16 9V11L18.5 12.5C19 13 19 14 18.5 14.5L16 16V14H14V16L11.5 17.5C11 18 10 18 9.5 17.5L7 16V14L9.5 12.5C10 12 10 11 9.5 10.5L7 9V11L4.5 12.5C4 13 3 13 2.5 12.5L0 11V9L2.5 7.5C3 7 3 6 2.5 5.5L0 4V2L2.5 0.5C3 0 4 0 4.5 0.5L7 2V4L4.5 5.5C4 6 4 7 4.5 7.5L7 9H9V7C9 5.9 9.9 5 11 5H13C14.1 5 15 5.9 15 7V9H21Z"/>
                </svg>
            )},
    ];

    const internalPatterns = [
        { id: 'x-internal', component: () => (
                <svg className="w-full h-full" viewBox="0 0 40 40">
                    <line x1="10" y1="10" x2="30" y2="30" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="30" y1="10" x2="10" y2="30" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
            )},
        { id: 'large-square', component: () => (
                <div className="w-4 h-4 bg-current"></div>
            )},
        { id: 'medium-square', component: () => (
                <div className="w-3 h-3 bg-current"></div>
            )},
        { id: 'small-circle', component: () => (
                <div className="w-2 h-2 bg-current rounded-full"></div>
            )},
        { id: 'outlined-square-1', component: () => (
                <div className="w-4 h-4 border border-current bg-gray-200 flex items-center justify-center">
                    <div className="w-2 h-2 bg-current"></div>
                </div>
            )},
        { id: 'outlined-square-2', component: () => (
                <div className="w-4 h-4 border border-current bg-gray-200 flex items-center justify-center">
                    <div className="w-2 h-2 bg-current"></div>
                </div>
            )},
        { id: 'outlined-square-3', component: () => (
                <div className="w-4 h-4 border border-current bg-gray-200 flex items-center justify-center">
                    <div className="w-2 h-2 bg-current"></div>
                </div>
            )},
        { id: 'outlined-square-4', component: () => (
                <div className="w-4 h-4 border border-current bg-gray-200 flex items-center justify-center">
                    <div className="w-2 h-2 bg-current"></div>
                </div>
            )},
        { id: 'diamond', component: () => (
                <div className="w-3 h-3 bg-current rotate-45 border border-gray-300"></div>
            )},
        { id: 'diamond-2', component: () => (
                <div className="w-3 h-3 bg-current rotate-45 border border-gray-300"></div>
            )},
        { id: 'star', component: () => (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
            )},
        { id: 'flower', component: () => (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="8" r="1.5"/>
                    <circle cx="12" cy="16" r="1.5"/>
                    <circle cx="8" cy="12" r="1.5"/>
                    <circle cx="16" cy="12" r="1.5"/>
                </svg>
            )},
    ];

    const PatternGrid = ({ patterns, selected, onSelect, colorValue }) => (
        <div className="grid grid-cols-4 gap-3 mb-6">
            {patterns.map((pattern) => (
                <button
                    key={pattern.id}
                    onClick={() => onSelect(pattern.id)}
                    className={`
            w-16 h-16 border-2 rounded-lg flex items-center justify-center
            transition-all duration-200 hover:bg-gray-50
            ${selected === pattern.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
          `}
                    style={{ color: colorValue }}
                >
                    <pattern.component />
                </button>
            ))}
        </div>
    );

    const ColorSection = ({
                              title,
                              color,
                              onColorChange,
                              gradient,
                              onGradientChange,
                              patterns,
                              selected,
                              onSelect
                          }) => (
        <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>

            <PatternGrid
                patterns={patterns}
                selected={selected}
                onSelect={onSelect}
                colorValue={color}
            />

            <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={`${title.toLowerCase()}-type`}
                        checked={!gradient}
                        onChange={() => onGradientChange(false)}
                        className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-600">Single Color</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={`${title.toLowerCase()}-type`}
                        checked={gradient}
                        onChange={() => onGradientChange(true)}
                        className="w-4 h-4 text-gray-400"
                    />
                    <span className="text-sm text-gray-400">Color Gradient</span>
                </label>
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={color}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                    placeholder="#000000"
                />
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Pipette size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ColorSection
                        title="External Eye Patterns"
                        color={externalColor}
                        onColorChange={setExternalColor}
                        gradient={externalGradient}
                        onGradientChange={setExternalGradient}
                        patterns={externalPatterns}
                        selected={selectedExternal}
                        onSelect={setSelectedExternal}
                    />

                    <ColorSection
                        title="Internal Eye Patterns"
                        color={internalColor}
                        onColorChange={setInternalColor}
                        gradient={internalGradient}
                        onGradientChange={setInternalGradient}
                        patterns={internalPatterns}
                        selected={selectedInternal}
                        onSelect={setSelectedInternal}
                    />
                </div>
            </div>
        </div>
    );
};

export default EyePatternsUI;
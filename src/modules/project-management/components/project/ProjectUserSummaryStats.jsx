import React, {useEffect, useMemo, useState} from "react";

import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping,} from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {Link} from "react-router-dom";
import useFullScreen from "@hooks/useFullScreen.js";

const ProjectUserSummaryStats = ({summary, statsFetching, height = 315}) => {


    const { isFullscreen, handleFullscreenClick } = useFullScreen();
    const containerHeight = isFullscreen ? "calc(100vh - 100px)" : height;

    // Search state
    const [searchTerm, setSearchTerm] = useState("");

    // Filter categories & series based on search term
    const displaySummary = useMemo(() => {
        if (!searchTerm.trim()) {
            return summary;
        }
        const lower = searchTerm.toLowerCase();
        // Find indices of matching categories
        const matchedIndices = summary.categories
            .map((cat, idx) => ({ cat, idx }))
            .filter(({ cat }) => cat.toLowerCase().includes(lower))
            .map(({ idx }) => idx);

        const filteredCategories = matchedIndices.map(i => summary.categories[i]);
        const filteredSeries = summary.series.map(serie => ({
            ...serie,
            data: matchedIndices.map(i => serie.data[i] ?? 0),
        }));

        return {
            categories: filteredCategories,
            series: filteredSeries,
        };
    }, [searchTerm, summary]);
    const colors = useMemo(() => {
        return mapSeriesToColors(summary?.series, statusColorMapping);
    }, []);

    return (
        <div className={`box custom-card ${isFullscreen ? 'box-fullscreen' : ''}`} >
            <div className="box-header justify-between">
                <div className="box-title">Resource Planning Summary</div>
                <div className="flex items-center gap-2">
                    <input
                        className="ti-form-control form-control-sm"
                        type="text"
                        placeholder="Search Here"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />

                    <Link aria-label="anchor" to="#" className="terms-fullscreen" onClick={handleFullscreenClick}>
                        <i className="ri-fullscreen-line"></i>
                    </Link>
                </div>
            </div>

            <div className="box-body !p-0" >
                {statsFetching ? (<LoadingSpinner/>) : (
                    <>
                        <div className="p-6 pb-2">
                            <ApexChart
                                colors={colors}
                                height={height}
                                columnWidth='80%'
                                categories={displaySummary.categories}
                                series={displaySummary.series}
                                stacked={false}
                                additionalOptions={{
                                    stroke: {
                                        width: 2,
                                    }
                                }}
                                baseWidthPerCategory={200}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>);
};

export default ProjectUserSummaryStats;

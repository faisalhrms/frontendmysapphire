import React, { useMemo, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import MilestonesStatsModal from "@modules/dashboards/pms/components/MilestonesStatsModal.jsx";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const RiskManagementChartNew = ({ data }) => {
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const closeMilestoneModal = () => {
        setIsMilestoneModalOpen(false);
        setSelectedProjectId(null);
    };

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.series, statusColorMapping);
    }, [data?.series]);

    const handlePointClick = (event, elements) => {
        if (elements.length > 0) {
            const dataPointIndex = elements[0].index;
            const projectId = data?.details?.[dataPointIndex]?.id;

            if (projectId) {
                setSelectedProjectId(projectId);
                setIsMilestoneModalOpen(true);
            }
        }
    };

    // Chart.js data configuration
    const chartData = {
        labels: data.categories, // X-axis labels (project names)
        datasets: [
            {
                type: 'bar',
                label: 'Actual Progress',
                data: data.series[1].data, // Actual Progress data
                backgroundColor: 'rgba(38, 191, 148, 0.2)', // Green fill for bars
                borderColor: 'rgb(38, 191, 148)', // Border color for bars
                borderWidth: 1
            },
            {
                type: 'line', // Line chart for Expected Progress
                label: 'Expected Progress',
                data: data.series[0].data, // Expected Progress data
                borderColor: 'rgb(132, 90, 223)',
                pointBackgroundColor: 'rgba(132, 90, 223, 0.2)',
                pointRadius: 10,
                pointHoverRadius: 15,
                pointStyle: 'rect',
            },
            {
                type: 'line', // Line chart for Expected Progress
                label: 'Variance',
                data: data.series[2].data, // Expected Progress data
                borderColor: 'rgb(245, 184, 73)',
                pointBackgroundColor: 'rgba(245, 184, 73, 0.2)',
                pointStyle: 'rect',
                pointRadius: 10,
                pointHoverRadius: 15,
            },
        ],
    };

    // Chart.js options configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: false, // No stacking on the X-axis
                grid: {
                    display: false, // Disable grid lines for the X-axis
                },
            },
            y: {
                stacked: false, // No stacking on the Y-axis
                beginAtZero: true,
                min: 0,
                title: {
                    display: true,
                    text: 'Progress (%)',
                },
                grid: {
                    color: 'rgba(0,0,0,0.04)', // Light gray grid lines
                    borderDash: [5, 5], // Dashed grid lines
                    drawBorder: false, // Disable the border line
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}%`;
                    },
                },
            },
            legend: {
                position: 'top',
            },
        },
        onClick: (event, elements) => {
            handlePointClick(event, elements);
        },
    };

    return (
        <>
            <div className="xl:col-span-12 col-span-12">
                <div className="box">
                    <div className="box-header justify-between">
                        <div className="box-title">Risk Analysis Summary</div>
                    </div>
                    <div className="box-body">
                        <div id="projectAnalysis" style={{ height: '500px' }}>
                            <Chart type="bar" data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {isMilestoneModalOpen && selectedProjectId && (
                <MilestonesStatsModal
                    onClose={closeMilestoneModal}
                    projectId={selectedProjectId}
                />
            )}
        </>
    );
};

export default React.memo(RiskManagementChartNew);
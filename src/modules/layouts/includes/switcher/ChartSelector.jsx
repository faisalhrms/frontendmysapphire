import {useDispatch, useSelector} from "react-redux";
import {chartSetup, initializeChartType} from "@modules/layouts/includes/switcher/SwitcherData.jsx";
import {useEffect} from "react";


const ChartSelector = ({}) => {
    const dispatch = useDispatch();
    const currentChartType = useSelector((state) => state.theme.chartType);

    useEffect(() => {
        initializeChartType(dispatch);
    }, [dispatch]);

    const chartTypes = [
        { id: "bar", label: "Bar Chart", icon: "📊" },
        { id: "pie", label: "Pie Chart", icon: "🥧" },
        { id: "line", label: "Line Chart", icon: "📈" },
        { id: "area", label: "Area Chart", icon: "🔷" },
        { id: "scatter", label: "Scatter Chart", icon: "⚫" },
        { id: "radar", label: "Radar Chart", icon: "🛡️" },
        { id: "composed", label: "Composed Chart", icon: "🔀" },
        { id: "radial", label: "Radial Chart", icon: "⭕" },
        // { id: "treemap", label: "Treemap Chart", icon: "🟦" },
        { id: "funnel", label: "Funnel Chart", icon: "🔄" },
    ];

    return (
        <div>
            <p className="switcher-style-head">Chart Style:</p>
            <div className="grid grid-cols-2 gap-2 switcher-style">
                    {chartTypes.map((chart) => (
                        <div className="flex" key={chart.id} >
                            <input
                                type="radio"
                                name="chart-selector"
                                className="ti-form-radio"
                                id={`switcher-chart-${chart.id}`}
                                checked={currentChartType === chart.id}
                                onChange={() => chartSetup[`Chart${chart.id.charAt(0).toUpperCase() + chart.id.slice(1)}`](dispatch)}
                            />
                            <label htmlFor={`switcher-chart-${chart.id}`} className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                                {chart.label}
                            </label>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ChartSelector;
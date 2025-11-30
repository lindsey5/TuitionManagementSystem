import { type FC } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

Charts(FusionCharts);
FusionTheme(FusionCharts);

interface BarChartProps {
    title: string;
    yName: string;
    xName: string;
    data: { label: string; value: string | number }[];
}

const BarChart: FC<BarChartProps> = ({ title, yName, data, xName }) => {
    const chartConfigs = {
        type: "column2d",
        width: "100%",
        height: "500",
        dataFormat: "json" as const,
        dataSource: {
            chart: {
                caption: title,
                yAxisName: yName,
                xAxisName: xName,
                theme: "fusion",
                paletteColors: "#6a1b9a, #f57c00, #039be5, #43a047",
                showValues: "1",
                formatNumberScale: "0",
            },
            data,
        },
    };

    return <ReactFusioncharts {...chartConfigs} />;
};

export default BarChart;
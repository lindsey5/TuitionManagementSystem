import { type FC } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

Charts(FusionCharts);
FusionTheme(FusionCharts);

interface LineChartProps {
    title: string;
    yName: string;
    data: { label: string; value: string | number }[];
}

const LineChart: FC<LineChartProps> = ({
    title,
    yName,
    data,
}) => {
    const chartConfigs = {
        type: 'line',
        width: "100%",
        height: "500",
        dataFormat: "json" as const,
        dataSource: {
        chart: {
            caption: title,
            yAxisName: yName,
            xAxisName: "Date",
            theme: "fusion",
            lineThickness: "2",
            anchorRadius: "4",
            formatNumberScale: "0",
        },
        data,
        },
    };

    return <ReactFusioncharts {...chartConfigs} />;
};

export default LineChart;

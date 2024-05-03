"use client"
import ReactApexChart from "react-apexcharts";
import { useState } from "react";

const Chart = ({ sparkline, priceChange }) => {
    const [chartOptions] = useState({
        series: [{
            data: [...sparkline.price],
        }],
        chart: {
            type: "line",
            height: 80,
            sparkline: { enabled: true },
            animations: { enabled: false },
        },
        tooltip: { enabled: false },
        stroke: { width: 1 },
        colors: [chartColor()],
    });

    function chartColor() {
        if (priceChange <= 0) {
            // Red for negative change
            return "#ff3131";
        } else {
            // Green for positive change
            return "#25df3e";
        }
    }

    return (
        <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="line"
            height={80}
        />
    );
};

export default Chart;

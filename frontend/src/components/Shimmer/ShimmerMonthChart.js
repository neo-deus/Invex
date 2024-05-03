"use client"
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
import HC_exportData from "highcharts/modules/export-data";
import HC_accessibility from "highcharts/modules/accessibility";
import axios from "axios";

// Load modules
HC_exporting(Highcharts);
HC_exportData(Highcharts);
HC_accessibility(Highcharts);

const PieShimmerChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
      // Simulate fetching data from an API
      const fetchData = async () => {
        try {
          // Simulate an API call with a delay
         
            // Mock response from the backend
            const response = {
              data: {
                month: {
                  "Electronics": 12000,
                  "Books": 3000,
                  "Clothing": 8000,
                  "Grocery": 5000,
                  "Utilities": 7000,
                }
              }
            };
  
            // Transform the data into the format Highcharts expects
            const transformedData = Object.entries(response.data.month).map(([key, value]) => ({
              name: key,
              y: value
            }));
  
            // Update state with the transformed data
            setChartData(transformedData);
         
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
  
      fetchData();
    }, []);
  

  useEffect(() => {

    // Define custom animation for pie series
    Highcharts.seriesTypes.pie.prototype.animate = function (init) {
      const series = this,
        chart = series.chart,
        points = series.points,
        { animation } = series.options,
        { startAngleRad } = series;

      if (init) {
        points.forEach((point) => {
          point.opacity = 0;
        });
      } else {
        fanAnimate(points[0], startAngleRad);
      }

      function fanAnimate(point, startAngleRad) {
        const graphic = point && point.graphic, // Check if point is defined first
        args = point && point.shapeArgs; 

        if (graphic && args) {
          graphic
            .attr({
              start: startAngleRad,
              end: startAngleRad,
              opacity: 1,
            })
            .animate(
              {
                start: args.start,
                end: args.end,
              },
              {
                duration: animation.duration / points.length,
              },
              function () {
                if (points[point.index + 1]) {
                  fanAnimate(points[point.index + 1], args.end);
                }
                if (point.index === series.points.length - 1) {
                  // Update pie to donut only after the last animation completes
                  chart.update(
                    {
                      plotOptions: {
                        pie: {
                          innerSize: "70%", // Creates a donut effect
                          borderRadius: 10,
                        },
                      },
                    },
                    false
                  ); // False to avoid redrawing immediately
                  points.forEach((point) => {
                    point.opacity = 1;
                  });
                  series.update({ enableMouseTracking: true });
                  // Now redraw the chart to apply the updates
                  chart.redraw();
                }
              }
            );
        }
      }
      
    };
  }, []);

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    credits: {
      enabled: false
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        borderRadius: 30,
        borderWidth: 2,
        cursor: "pointer",
        showInLegend: true,
        dataLabels: {
          enabled: false,
          // format: '<b>{point.name}</b><br>{point.percentage}%',
          distance: 0,
        },
      },
    },
    legend: {
      layout: "horizontal", // Change layout to horizontal
      align: "center",
      verticalAlign: "bottom",
      useHTML: true,
      width: 360, // Set a specific width to encourage a two-column layout
      itemWidth: 180, // Approximate width of each column
      symbolRadius: 2, // Makes the legend symbol squares
      symbolHeight: 12,
      labelFormatter: function () {
        return `${this.name}: <b>${this.y}</b>`; // Custom format
      },
      
    },
    colors: [
        "#f0f0f0", // Very light grey
        "#d9d9d9", // Light grey
        "#bdbdbd", // Medium grey
        "#969696", // Dark grey
        "#636363"  // Very dark grey
      ],
    series: [
      {
        enableMouseTracking: false,
        animation: {
          duration: 2000,
        },
        colorByPoint: true,
        data: chartData,
        // data: [
        //   {
        //     name: "Customer Support",
        //     y: 21.3,
        //   },
        //   {
        //     name: "Development",
        //     y: 18.7,
        //   },
        //   {
        //     name: "Sales",
        //     y: 20.2,
        //   },
        //   {
        //     name: "Marketing",
        //     y: 14.2,
        //   },
        //   {
        //     name: "Other",
        //     y: 25.6,
        //   },
        // ],
      },
    ],
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{
          style: { height: "450px", maxWidth: "600px", margin: "0 auto" },
        }}
      />
    </div>
  );
};

export default PieShimmerChart;
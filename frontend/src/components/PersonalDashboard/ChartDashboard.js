// import React, { useEffect, useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import HC_exporting from "highcharts/modules/exporting";
// import HC_exportData from "highcharts/modules/export-data";
// import HC_accessibility from "highcharts/modules/accessibility";

// HC_exporting(Highcharts);
// HC_exportData(Highcharts);
// HC_accessibility(Highcharts);

// const BarGraphComponent = () => {

//   const processDataForChart = (data) => {
//     const incomeData = [];
//     const expenseData = [];
//     const categories = [];

//     data.yearly.forEach((item) => {
//       const month = new Date(0, parseInt(item.Month) - 1).toLocaleString('default', { month: 'short' });
//       categories.push(month);
//       incomeData.push(item.Income);
//       expenseData.push(item.Expense);
//     });

//     return {
//       categories,
//       series: [
//         {
//           name: 'Income',
//           data: incomeData,
//           color: 'rgba(54, 162, 235, 0.7)'
//         },
//         {
//           name: 'Expense',
//           data: expenseData,
//           color: 'rgba(255, 99, 132, 0.7)'
//         }
//       ]
//     };
//   };

//   const dynamicData = {
//     yearly: [
//       { Month: "01", Income: 30000, Expense: 20000 },
//       { Month: "02", Income: 30000, Expense: 8000 },
//       { Month: "03", Income: 30000, Expense: 20000 },
//       { Month: "04", Income: 30000, Expense: 7600 },
//       { Month: "05", Income: 20000, Expense: 30000 },
//       { Month: "06", Income: 20000, Expense: 30000 },
//       { Month: "07", Income: 10000, Expense: 20000 },
//       { Month: "08", Income: 30000, Expense: 20000 },
//       { Month: "09", Income: 0, Expense: 20000 },
//       { Month: "10", Income: 30000, Expense: 20000 },
//       { Month: "11", Income: 22220, Expense: 33330 },
//       { Month: "12", Income: 1110, Expense: 0 },
//     ],
//   };

//   const { categories, series } = processDataForChart(dynamicData);

//   const options = {
//     chart: {
//       type: "column",
//       // styledMode: true
//     },
//     title: {
//       text: "Average weight and BMI in some countries, women",
//       align: "left",
//     },
//     // subtitle: {
//     //   text: 'Source: ' +
//     //     '<a href="https://www.worlddata.info/average-bodyheight.php" ' +
//     //     'target="_blank">WorldData</a>',
//     //   align: 'left'
//     // },
//     xAxis: {
//       categories: categories/*["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]*/,
//     },
//     yAxis: {
//       min: 0,
//       title: {
//         text: null
//       },
//       // labels: {
//       //   overflow: "justify",
//       // },
//     },
//     tooltip: {
//       shared: true,
//       valuePrefix: "$",
//     },
//     // plotOptions: {
//     //   column: {
//     //     borderRadius: 5,
//     //     pointWidth: 20,
//     //     //pointPadding: 0.05,
//     //     //groupPadding: 0.1,
//     //   },
//     // },
//     plotOptions: {
//       series: {
//         point: {
//           events: {
//             mouseOver: function () {
//               const chart = this.series.chart;
//               const index = this.index;

//               // Loop over all series to apply the dimming
//               chart.series.forEach((series) => {
//                 // Apply dimming only to non-hovered series points with the same index
//                 series.points.forEach((point) => {
//                   if (point.index !== index) {
//                     Highcharts.css(point.graphic.element, {
//                       opacity: 0.2,
//                     });
//                   }
//                 });
//               });

//               // Highlight all points for the hovered index (month)
//               chart.series.forEach((series) => {
//                 if (series.points[index]) {
//                   Highcharts.css(series.points[index].graphic.element, {
//                     opacity: 1,
//                   });
//                 }
//               });
//             },
//             mouseOut: function () {
//               const chart = this.series.chart;

//               // Restore the opacity for all points
//               chart.series.forEach((series) => {
//                 series.points.forEach((point) => {
//                   Highcharts.css(point.graphic.element, {
//                     opacity: 1,
//                   });
//                 });
//               });
//             }
//           }
//         },
//         states: {
//           hover: {
//             enabled: true, // Enable the hover state
//             brightness: 0.1, // Slight brightness on hover
//           }
//         }
//       },
//       column: {
//         // Other column options here
//       }
//     },
//     credits: {
//       enabled: false,
//     },
//     series:  series

//   };

//   return (
//     <div>
//       <HighchartsReact highcharts={Highcharts} options={options} />
//     </div>
//   );
// };

// export default BarGraphComponent;

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Make sure axios is imported
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
import HC_exportData from "highcharts/modules/export-data";
import HC_accessibility from "highcharts/modules/accessibility";
import ShimmerBarComponent from "../Shimmer/ShimmerBarChart";

HC_exporting(Highcharts);
HC_exportData(Highcharts);
HC_accessibility(Highcharts);

const BarGraphComponent = () => {
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  // Initialize chartData as an object with categories and series keys
  const [chartData, setChartData] = useState({ categories: [], series: [] });

  const processDataForChart = (data) => {
    const incomeData = [];
    const expenseData = [];
    const categories = [];

    data.yearly.forEach((item) => {
      const month = new Date(0, parseInt(item.Month, 10) - 1).toLocaleString(
        "default",
        { month: "short" }
      );
      categories.push(month);
      incomeData.push(item.Income);
      expenseData.push(item.Expense);
    });

    return {
      categories,
      series: [
        {
          name: "Income",
          data: incomeData,
          color: "rgba(54, 162, 235, 0.7)",
        },
        {
          name: "Expense",
          data: expenseData,
          color: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(`/api/analysis/yearly?email=${email}`);
        const formattedData = processDataForChart(response.data);
        setChartData(formattedData); // Update the chart data state
        // console.log(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    if (email) {
      fetchChartData();
      const intervalId = setInterval(() => {
        fetchChartData(); // Your function that fetches the latest chart data
      }, 10000); // Fetch every 10 seconds

      return () => clearInterval(intervalId); // Your function that fetches the latest chart data
    }
  }, []);
  const maxIncome = Math.max(...(chartData.series[0]?.data ?? [0]));
  const maxExpense = Math.max(...(chartData.series[1]?.data ?? [0]));
  const yAxisMax = Math.max(maxIncome, maxExpense);

  // The chartOptions should be a part of the state or at least derived state from chartData
  // This is because we are fetching data asynchronously
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Monthly Income and Expenses",
      align: "left",
    },
    xAxis: {
      categories: chartData.categories,
    },
    yAxis: {
      min: 0,
      // max: yAxisMax + (0.1 * yAxisMax),
      title: {
        text: "Amount (₹)", // Use the symbol for Indian Rupee
      },
      labels: {
        format: "₹{value}", // Format the y-axis labels to show currency
      },
      //tickInterval: Math.ceil(yAxisMax / 5),
    },
    tooltip: {
      shared: true,
      valuePrefix: "₹",
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    plotOptions: {
      series: {
        point: {
          events: {
            mouseOver: function () {
              const chart = this.series.chart;
              const index = this.index;

              // Loop over all series to apply the dimming
              chart.series.forEach((series) => {
                // Apply dimming only to non-hovered series points with the same index
                series.points.forEach((point) => {
                  if (point.index !== index) {
                    Highcharts.css(point.graphic.element, {
                      opacity: 0.2,
                    });
                  }
                });
              });

              // Highlight all points for the hovered index (month)
              chart.series.forEach((series) => {
                if (series.points[index]) {
                  Highcharts.css(series.points[index].graphic.element, {
                    opacity: 1,
                  });
                }
              });
            },
            mouseOut: function () {
              const chart = this.series.chart;

              // Restore the opacity for all points
              chart.series.forEach((series) => {
                series.points.forEach((point) => {
                  Highcharts.css(point.graphic.element, {
                    opacity: 1,
                  });
                });
              });
            },
          },
        },
        states: {
          hover: {
            enabled: true, // Enable the hover state
            brightness: 0.1, // Slight brightness on hover
          },
        },
      },
      column: {
        borderRadius: 5,
        pointWidth: 28,
        pointPadding: 0.05,
        groupPadding: 0.1,
      },
    },
    credits: {
      enabled: false,
    },
    series: chartData.series,
  };
  return (
    <div>
      {chartData && chartData.categories.length > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <ShimmerBarComponent /> // Display loading or some placeholder
      )}
    </div>
  );
};

export default BarGraphComponent;

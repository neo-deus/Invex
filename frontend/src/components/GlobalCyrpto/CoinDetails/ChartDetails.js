import React, { useContext, useEffect, useState } from 'react';
import { CryptoContext } from "@/Context/Cyrpto";
import ReactApexChart from 'react-apexcharts';

const ChartComponent = ({ data, currency, type }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return  <div
        className="w-full h-full flex justify-center items-center
       "
      >
        <div
          className="w-3 h-3 border-4 border-cyan-700 rounded-full
       border-b-gray-200 animate-spin
       "
          role="status"
        />
        <span className="ml-2">Loading...</span>
      </div>; // Checks for data existence and proper structure
    }

    // Extracting dates and values for the chart
    const dates = data.map((price) => new Date(price[0]).toLocaleDateString());
    const prices = data.map(price => {
        if (isNaN(parseFloat(price[1]))) {
            console.error('Invalid price data:', price[1]);
            return '0.00'; // Return '0.00' or some other default value
        }
        return parseFloat(price[1]).toFixed(2);
    });

    const options = {
        chart: {
            toolbar: {
                tools: {
                    pan: false,
                }
            },
            type: 'area',
            zoom: {
                enabled: true,
            },
            foreColor: '#ffffff', // Sets the color of the text for the entire chart
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.0,
                stops: [0, 100],
                colorStops: [
                    {
                        offset: 0,
                        color: "#5356FF",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        opacity: 0.5
                    }
                ]
            }
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                    strokeWidth: 1
                }
            },
            yaxis: {
                lines: {
                    show: false,
                }
            }
        },
        title: {
            text: type,
            align: 'left',
            style: {
                color: '#ffffff',
            },
        },
        xaxis: {
            categories: dates,
            tickAmount: 6,
            tooltip: {
                enabled: false,
            },
            labels: {
                rotate: 0,
                style: {
                    colors: '#ffffff',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#ffffff',
                },
            },
        },
        tooltip: {
            theme: 'dark', // Use 'dark' theme which generally has a black background
            x: {
                show: true
            },
            y: {
                formatter: (val) => `${parseFloat(val).toFixed(2)}`, // Custom formatter if you need to format the y-values
                title: {
                    formatter: (seriesName) => `${seriesName}:` // Custom formatter for the series name
                }
            },
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
            marker: {
                show: false,
            },
        }
    };
    

  const series = [
    {
      name: "Price",
      data:  prices.map(price => parseFloat(price)),
    },
  ];

  return (
    <ReactApexChart options={options} series={series} type="area" height={350} />
  );
};

const ChartDetails=({id})=>{
    const [chartData, setChartData] = useState();
    let { currency } = useContext(CryptoContext);
    const [type, setType] = useState("prices");
    const [days, setDays] = useState(1);
  
    useEffect(() => {
      const getChartData = async (id) => {
        try {
          const data = await fetch(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`,
            {headers:{
                "x-cg-demo-api-key": "CG-YkDCZeia3Rt81Xesk36q17Mq",
            }}
          )
            .then((res) => res.json())
            .then((json) => json);
  
          // console.log("chart-data", data);
  
  
         
          setChartData(data[type]);
          console.log(data[type])
        } catch (error) {
          console.log(error);
        }
      };
  
      getChartData(id);
    }, [id, type, days]);
  
    return (
      <div className="w-full h-[60%]">
        <ChartComponent data={chartData} currency={currency} type={type} />
        <div className="flex">
          <button
            className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${
              type === "prices"
                ? "bg-cyan text-cyan"
                : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => setType("prices")}
          >
            Price
          </button>
          <button
            className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${
              type === "market_caps"
                ? "bg-cyan text-cyan"
                : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => setType("market_caps")}
          >
            market caps
          </button>
          <button
            className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${
              type === "total_volumes"
                ? "bg-cyan text-cyan"
                : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => setType("total_volumes")}
          >
            total volumes
          </button>
  
          <button
            className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${
              days === 1 ? "bg-cyan text-cyan" : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => setDays(1)}
          >
            1d
          </button>
          
          <button
            className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${
              days === 30? "bg-cyan text-cyan" : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => setDays(30)}
          >
            30d
          </button>
          <button
            className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${
              days === 365 ? "bg-cyan text-cyan" : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => setDays(365)}
          >
            365d
          </button>
        </div>
      </div>
    )
}
export default ChartDetails;
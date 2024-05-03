"use client"
// CardComponent.jsx

import React from "react";
import { Line } from "react-chartjs-2";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CardComponent = ({ title, value, percentage, chartType, data }) => {
  const lineChartOptions = {
    // Options for the line chart if needed
    responsive: true,
    maintainAspectRatio: false,
  };

  const circularProgressOptions = {
    // Customize the colors, stroke width, etc.
    pathColor: `rgba(62, 152, 199, )`, // ${percentage / 100}
    textColor: "#f88",
    trailColor: "#d6d6d6",
    backgroundColor: "#3e98c7",
  };

  return (
    <div className="card bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="card-content p-4 flex items-center">
        <div className="flex-grow">
          <div className="card-title text-xl font-semibold">{title}</div>
          <div className="card-value text-3xl font-bold my-2">{value}</div>
        </div>
        <div className="flex-shrink-0">
          <div className="card-chart w-40 h-40">
            {" "}
            {/* Fixed width and height */}
            {chartType === "line" && (
              <Line data={data} options={lineChartOptions} />
            )}
            {chartType === "circular" && (
              <div style={{ width: "100%", height: "100%" }}>
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  styles={buildStyles(circularProgressOptions)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;

// 'use client'
// import React from "react";
// import "react-circular-progressbar/dist/styles.css";

// // Dynamic imports for chart components
// const Line = React.lazy(() => import("react-chartjs-2").then(module => ({ default: module.Line })));
// const CircularProgressbar = React.lazy(() => import("react-circular-progressbar").then(module => ({ default: module.CircularProgressbar })));
// const buildStyles = React.lazy(() => import("react-circular-progressbar").then(module => ({ default: module.buildStyles })));

// const CardComponent = ({ title, value, percentage, chartType, data }) => {
//   const lineChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//   };

//   const circularProgressOptions = {
//     pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
//     textColor: "#f88",
//     trailColor: "#d6d6d6",
//     backgroundColor: "#3e98c7",
//   };

//   return (
//     <div className="card bg-white shadow-lg rounded-lg overflow-hidden">
//       <div className="card-content p-4 flex items-center">
//         <div className="flex-grow">
//           <div className="card-title text-xl font-semibold">{title}</div>
//           <div className="card-value text-3xl font-bold my-2">{value}</div>
//         </div>
//         <div className="flex-shrink-0">
//           <div className="card-chart w-40 h-40">
//             <React.Suspense fallback={<div>Loading Chart...</div>}>
//               {chartType === "line" && (
//                 <Line data={data} options={lineChartOptions} />
//               )}
//               {chartType === "circular" && (
//                 <div style={{ width: "100%", height: "100%" }}>
//                   <CircularProgressbar
//                     value={percentage}
//                     text={`${percentage}%`}
//                     styles={buildStyles(circularProgressOptions)}
//                   />
//                 </div>
//               )}
//             </React.Suspense>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardComponent;

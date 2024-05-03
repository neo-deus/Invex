"use client";
import React from "react";
import BarGraphComponent from "@/components/PersonalDashboard/ChartDashboard";
import PieChart from "@/components/PersonalDashboard/WeeklySpendingPieChart";
import DashboardBox from "@/components/PersonalDashboard/DashboardBox";
import Sidebar from "@/components/PersonalDashboard/Sidebar";
import TransactionComponent from "@/components/PersonalDashboard/TransactionComponent";
import LearningDetails from "@/components/PersonalDashboard/LearningDetails";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const Dashboard = () => {
  return (
    <div className="bg-slate-500 min-w-screen min-h-screen">
      <div className="flex bg-slate-500 min-w-screen">
        <Sidebar />
        <div className="flex ml-12">
          <div className="w-6/7 flex-col">
            <DashboardBox />
            <div className="ml-24">
              <BarGraphComponent />
            </div>
            <div className=" bg-slate-400 ml-24 mt-6 flex min-h-32 overflow-y-auto no scrollbar">
              <div className="w-5/6">
                <LearningDetails />
              </div>
              <div className="w-1/6">
                {/* <YouTubeVideos /> */}
              </div>
            </div>
          </div>
          <div className="w-1/7 ml-6 mt-28">
            <div>
              <TransactionComponent />
            </div>
            <div className=" w-[350px] h-[200px] mt-7">
              <PieChart />
            </div>
          </div>
        </div>
        {/* <div className="flex-col w-  mt-10">
         
          <DashboardBox />
         
          <div className=" ml-20  p-6">
            <BarGraphComponent />
          </div>
          <div className="  ml-20  p-6">
            <LearningDetails />
          </div>
          <div className="  ml-20  p-6">
            <YouTubeVideos />
          </div> 
        </div> */}
        {/* <div className="flex-col w-1/4 mr-10 mt-24 ml-20">
          <TransactionComponent />
          <div className="mb-7"></div>
          <div className="w-[400px]  h-[300px] rounded-lg  mb-7">
           
            <PieChart />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;

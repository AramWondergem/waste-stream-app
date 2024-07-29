"use client";
import React from "react";
import BarChart from "../Charts/BarChart";
import BasicTable from "../Tables/BasicTable";
import BasicMap from "../Maps/BasicMap";
import DataStatsOne from "@/components/DataStats/DataStatsOne";

const ExplorationDashboard: React.FC = () => {
  return (
    <>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <BasicMap />
        <BarChart />
        <div className="col-span-12 xl:col-span-8">
          <BasicTable />
        </div>
      </div>
    </>
  );
};

export default ExplorationDashboard;

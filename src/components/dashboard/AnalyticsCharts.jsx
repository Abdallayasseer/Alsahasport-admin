import React from "react";
import Chart from "react-apexcharts";
import { Card } from "../ui/Card";

const commonOptions = (categories) => ({
  chart: {
    toolbar: { show: false },
    background: "transparent",
    foreColor: "#9ca3af",
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: categories || [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#9ca3af" } },
  },
  yaxis: {
    labels: { style: { colors: "#9ca3af" } },
  },
  grid: {
    show: false, 
    borderColor: "#333",
  },
  tooltip: {
    theme: "dark",
  },
});

export const SessionsChart = ({ data }) => {
  // 1. Safety Check
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 h-[400px] flex items-center justify-center text-zinc-500">
        No session data available
      </Card>
    );
  }

  // 2. Data Transformation (Recharts -> ApexCharts)
  const categories = data.map((item) => item.time);
  const seriesData = data.map((item) => item.value);

  const options = {
    ...commonOptions(categories),
    chart: { type: "area", ...commonOptions().chart },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    colors: ["#6366f1"], // Indigo
  };

  const series = [{ name: "Sessions", data: seriesData }];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        Active Sessions (24h)
      </h3>
      <div className="w-full h-[350px]">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    </Card>
  );
};

export const CodesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 h-[400px] flex items-center justify-center text-zinc-500">
        No generated codes data
      </Card>
    );
  }

  const categories = data.map((item) => item.date);
  const seriesData = data.map((item) => item.value);

  const options = {
    ...commonOptions(categories),
    chart: { type: "bar", ...commonOptions().chart },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "50%" },
    },
    colors: ["#72BF44"], // Neon Green
  };

  const series = [{ name: "Codes", data: seriesData }];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">Codes Generated</h3>
      <div className="w-full h-[350px]">
        <Chart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export const RoleDistChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 h-[400px] flex items-center justify-center text-zinc-500">
        No role distribution data
      </Card>
    );
  }

  // ApexCharts Donut expects simple arrays
  const labels = data.map((item) => item.name);
  const series = data.map((item) => item.value);

  const options = {
    chart: { type: "donut", background: "transparent", foreColor: "#9ca3af" },
    labels: labels,
    colors: ["#6366f1", "#8b5cf6", "#ec4899", "#10b981"],
    legend: { position: "bottom" },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              color: "#fff",
            },
          },
        },
      },
    },
    tooltip: { theme: "dark" },
    dataLabels: { enabled: false },
    stroke: { show: false },
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">Session Roles</h3>
      <div className="w-full h-[350px]">
        <Chart options={options} series={series} type="donut" height={350} />
      </div>
    </Card>
  );
};

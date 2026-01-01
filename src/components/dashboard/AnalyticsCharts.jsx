import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Card } from "../ui/Card";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Common chart options for a minimalist look
 * Disables scales, grid lines, and maintains responsiveness
 */
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
      grid: { display: false },
    },
    y: {
      display: false,
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1f2937",
      titleColor: "#f3f4f6",
      bodyColor: "#f3f4f6",
      borderColor: "#374151",
      borderWidth: 1,
      padding: 10,
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
};

/**
 * 1. SessionsChart (Line/Area with Gradient)
 */
export const SessionsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 h-[400px] flex items-center justify-center text-zinc-500">
        No session data available
      </Card>
    );
  }

  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: "Sessions",
        data: data.map((d) => d.value),
        borderColor: "#6366f1", // Indigo
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.05)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        Active Sessions (24h)
      </h3>
      <div className="w-full h-[300px]">
        <Line options={commonOptions} data={chartData} />
      </div>
    </Card>
  );
};

/**
 * 2. CodesChart (Bar)
 */
export const CodesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 h-[400px] flex items-center justify-center text-zinc-500">
        No generated codes data
      </Card>
    );
  }

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Codes",
        data: data.map((d) => d.value),
        backgroundColor: "#72BF44", // Neon Green
        borderRadius: 4,
        barThickness: "flex",
        maxBarThickness: 40,
      },
    ],
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">Codes Generated</h3>
      <div className="w-full h-[300px]">
        <Bar options={commonOptions} data={chartData} />
      </div>
    </Card>
  );
};

/**
 * 3. RoleDistChart (Doughnut)
 */
export const RoleDistChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 h-[400px] flex items-center justify-center text-zinc-500">
        No role distribution data
      </Card>
    );
  }

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: ["#6366f1", "#8b5cf6", "#ec4899", "#10b981"],
        borderColor: "#111827", // Match card bg for better separation
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: "75%",
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#9ca3af",
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">Session Roles</h3>
      <div className="w-full h-[300px]">
        <Doughnut options={doughnutOptions} data={chartData} />
      </div>
    </Card>
  );
};

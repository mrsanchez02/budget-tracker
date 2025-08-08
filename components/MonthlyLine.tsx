"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function MonthlyLine({ days, amounts }: { days: string[]; amounts: number[] }) {
  return (
    <div style={{height:320}}>
      <Line data={{ labels: days, datasets: [{ label: "Spending", data: amounts }] }}
        options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }}
      />
    </div>
  );
}

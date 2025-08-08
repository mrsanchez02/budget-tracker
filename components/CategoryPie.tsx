"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPie({ data }: { data: { label: string; value: number }[] }) {
  const labels = data.map(d => d.label);
  const values = data.map(d => d.value);
  return (
    <div style={{height:320}}>
      <Pie data={{ labels, datasets: [{ data: values }] }}
        options={{ plugins: { legend: { position: "bottom" } }, maintainAspectRatio: false }}
      />
    </div>
  );
}

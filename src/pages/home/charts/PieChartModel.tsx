import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { tableProps } from "../tables/Contributors";

export default function PieChartModel({ dataList }: tableProps) {
  const COLORS = [
    "#3A7F9C",
    "#E84C3D",
    "#2ECC71",
    "#9B59B6",
    "#F1C40F",
    "#3498DB",
    "#E67E22",
    "#1ABC9C",
    "#8E44AD",
    "#F39C12",
    "#16A085",
    "#D35400",
    "#2980B9",
    "#27AE60",
    "#C0392B",
    "#8F7A5E",
    "#BDC3C7",
    "#7F8C8D",
    "#E91E63",
    "#34495E",
  ];

  const chartData = dataList.map((item) => ({
    name: item.userName,
    value: item.contributions,
  }));

  const totalContributions = chartData.reduce(
    (sum, entry) => sum + entry.value,
    0
  );

  interface LabelProps {
    name: string;
    value: number;
    percent: number;
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    index: number;
  }

  const renderCustomLabel = ({
    name,
    value,
    percent,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: LabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = ((value / totalContributions) * 100).toFixed(1);

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${value} (${percentage}%)`}
      </text>
    );
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

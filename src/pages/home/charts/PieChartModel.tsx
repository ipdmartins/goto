import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { tableProps } from "../tables/Contributors";

export default function PieChartModel({ dataList }: tableProps) {
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
    percent?: number;
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    index?: number;
  }

  const generateColorCode = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, "0")}`;
  };

  const renderCustomLabel = ({
    name,
    value,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
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
        fill={generateColorCode()}
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
              <Cell key={`cell-${index}`} fill={generateColorCode()} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

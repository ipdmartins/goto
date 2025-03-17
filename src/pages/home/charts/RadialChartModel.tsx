import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IChartData {
  dataChart: [string, number][];
}

export default function RadialChartModel({ dataChart }: IChartData) {
  const transformDataForRadialChart = (data: [string, number][]) => {
    return data.map(([name, value]) => ({
      name,
      uv: value,
      pv: value * 100,
      fill: generateColorCode(),
    }));
  };

  const chartFormatData = transformDataForRadialChart(dataChart);

  const generateColorCode = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, "0")}`;
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="40%"
          cy="50%"
          innerRadius="10%"
          outerRadius="80%"
          barSize={10}
          data={chartFormatData}
        >
          <RadialBar
            minPointSize={15}
            label={{ position: "insideStart", fill: "#fff" }}
            background
            dataKey="uv"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{
              right: "5px",
              top: "50%",
              transform: "translateY(-50%)",
              maxHeight: "90%",
              overflowY: "auto",
              padding: "5px",
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

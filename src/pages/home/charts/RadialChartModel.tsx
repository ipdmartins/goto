import React, { PureComponent } from "react";
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

  const transformDataForRadialChart = (data: [string, number][]) => {
    return data.map(([name, value], index) => ({
      name,
      uv: value,
      pv: value * 100,
      fill: COLORS[index],
    }));
  };

  const chartFormatData = transformDataForRadialChart(dataChart);

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

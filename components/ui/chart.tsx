"use client"
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  Line,
} from "recharts"

interface ChartProps {
  data: any[]
  xField: string
  yField: string
  height: number
  colors: string[]
}

export const BarChart = ({ data, xField, yField, height, colors }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yField} fill={colors[0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export const LineChart = ({ data, xField, yField, height, colors }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={yField} stroke={colors[0]} strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

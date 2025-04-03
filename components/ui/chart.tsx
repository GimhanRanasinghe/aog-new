"use client"
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
} from "recharts"

interface BarChartProps {
  data: any[]
  xField: string
  yField: string
  colors: string[]
  height?: number
}

export function BarChart({ data, xField, yField, colors, height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yField} fill={colors[0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

interface LineChartProps {
  data: any[]
  xField: string
  yField: string
  colors: string[]
  height?: number
}

export function LineChart({ data, xField, yField, colors, height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={yField} stroke={colors[0]} />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}


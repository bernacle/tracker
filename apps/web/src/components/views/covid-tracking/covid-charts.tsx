'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartProps } from './types'

const CHART_COLORS = {
  baselineCases: '#8884d8',
  baselineDeaths: '#ff7300',
  comparisonCases: '#82ca9d',
  comparisonDeaths: '#ff0000',
}

export function CovidCharts({
  baselineData,
  comparisonData,
  type = 'cases',
}: ChartProps) {
  const renderCasesChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="newCases"
          data={baselineData}
          name="Baseline New Cases"
          stroke={CHART_COLORS.baselineCases}
        />
        {comparisonData && (
          <Line
            type="monotone"
            dataKey="newCases"
            data={comparisonData}
            name="Comparison New Cases"
            stroke={CHART_COLORS.comparisonCases}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )

  const renderDeathsChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="newDeaths"
          data={baselineData}
          name="Baseline New Deaths"
          stroke={CHART_COLORS.baselineDeaths}
        />
        {comparisonData && (
          <Line
            type="monotone"
            dataKey="newDeaths"
            data={comparisonData}
            name="Comparison New Deaths"
            stroke={CHART_COLORS.comparisonDeaths}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )

  const renderCombinedChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="newCases"
          data={baselineData}
          name="Baseline Cases"
          stroke={CHART_COLORS.baselineCases}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="newDeaths"
          data={baselineData}
          name="Baseline Deaths"
          stroke={CHART_COLORS.baselineDeaths}
        />
        {comparisonData && (
          <>
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="newCases"
              data={comparisonData}
              name="Comparison Cases"
              stroke={CHART_COLORS.comparisonCases}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="newDeaths"
              data={comparisonData}
              name="Comparison Deaths"
              stroke={CHART_COLORS.comparisonDeaths}
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>COVID-19 Statistics</CardTitle>
        <CardDescription>
          Visualization of selected demographic data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cases">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="deaths">Deaths</TabsTrigger>
            <TabsTrigger value="combined">Combined View</TabsTrigger>
          </TabsList>

          <TabsContent value="cases">{renderCasesChart()}</TabsContent>

          <TabsContent value="deaths">{renderDeathsChart()}</TabsContent>

          <TabsContent value="combined">{renderCombinedChart()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

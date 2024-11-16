'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartData, VaccinationData } from './types'

interface CovidData {
  id: string
  date: string
  newCases: number
  totalCases: number
  newDeaths: number
  totalDeaths: number
  countryId: string
}

interface Country {
  id: string
  name: string
  [key: string]: string | number | null
}

type ProcessedDataPoint = {
  [key: string]: string | number
}

interface ChartProps {
  baselineData: ChartData
  comparisonData: ChartData | null
}

const METRIC_OPTIONS = {
  COVID: {
    newCases: 'New Cases',
    totalCases: 'Total Cases',
    newDeaths: 'New Deaths',
    totalDeaths: 'Total Deaths',
  },
  VACCINATION: {
    totalVaccinations: 'Total Vaccinations',
    peopleVaccinated: 'People Vaccinated',
    peopleFullyVaccinated: 'Fully Vaccinated',
    totalVaccinationsPerHundred: 'Vaccination Rate (%)',
  },
} as const

type MetricKeys =
  | keyof typeof METRIC_OPTIONS.COVID
  | keyof typeof METRIC_OPTIONS.VACCINATION

const CHART_COLORS = {
  baseline: {
    primary: '#8884d8',
    secondary: '#82ca9d',
  },
  comparison: {
    primary: '#ff7300',
    secondary: '#ff0000',
  },
} as const

const processData = (
  covidData: CovidData[],
  vaccinationData: VaccinationData[]
): ProcessedDataPoint[] => {
  const mergedData = new Map<string, ProcessedDataPoint>()

  covidData.forEach((entry) => {
    const date = entry.date.split('T')[0]
    if (!mergedData.has(date)) {
      mergedData.set(date, { date })
    }
    const current = mergedData.get(date)!
    Object.entries(entry).forEach(([key, value]) => {
      if (value !== null && key !== 'id' && key !== 'countryId') {
        current[key] = value
      }
    })
  })

  vaccinationData.forEach((entry) => {
    const date = entry.date.split('T')[0]
    if (!mergedData.has(date)) {
      mergedData.set(date, { date })
    }
    const current = mergedData.get(date)!
    Object.entries(entry).forEach(([key, value]) => {
      if (value !== null && key !== 'id' && key !== 'countryId') {
        current[key] = value
      }
    })
  })

  return Array.from(mergedData.values()).sort(
    (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
  )
}

export const CovidCharts: React.FC<ChartProps> = ({
  baselineData,
  comparisonData,
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<{
    primary: MetricKeys
    secondary: keyof typeof METRIC_OPTIONS.VACCINATION
  }>({
    primary: 'newCases',
    secondary: 'totalVaccinationsPerHundred',
  })

  const getMetricLabel = (metric: MetricKeys): string => {
    return (
      METRIC_OPTIONS.COVID[metric as keyof typeof METRIC_OPTIONS.COVID] ||
      METRIC_OPTIONS.VACCINATION[
        metric as keyof typeof METRIC_OPTIONS.VACCINATION
      ] ||
      metric
    )
  }

  const renderMainChart = () => {
    const baselineProcessed = processData(
      baselineData.covidData,
      baselineData.vaccinationData
    )
    const comparisonProcessed = comparisonData
      ? processData(comparisonData.covidData, comparisonData.vaccinationData)
      : null

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date: string) =>
              new Date(date).toLocaleDateString()
            }
            angle={-45}
            textAnchor="end"
          />
          <YAxis
            yAxisId="left"
            label={{
              value: getMetricLabel(selectedMetrics.primary),
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: getMetricLabel(selectedMetrics.secondary),
              angle: 90,
              position: 'insideRight',
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload) return null
              return (
                <div className="rounded border bg-white p-4 shadow-lg">
                  <p className="font-bold">
                    {payload[0]?.payload?.date
                      ? new Date(payload[0].payload.date).toLocaleDateString()
                      : ''}
                  </p>
                  {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }}>
                      {entry.name}: {entry.value?.toLocaleString()}
                    </p>
                  ))}
                </div>
              )
            }}
          />
          <Legend />

          <Bar
            yAxisId="left"
            dataKey={selectedMetrics.primary}
            data={baselineProcessed}
            fill={CHART_COLORS.baseline.primary}
            name={`Baseline ${getMetricLabel(selectedMetrics.primary)}`}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={selectedMetrics.secondary}
            data={baselineProcessed}
            stroke={CHART_COLORS.baseline.secondary}
            name={`Baseline ${getMetricLabel(selectedMetrics.secondary)}`}
          />

          {comparisonProcessed && (
            <>
              <Bar
                yAxisId="left"
                dataKey={selectedMetrics.primary}
                data={comparisonProcessed}
                fill={CHART_COLORS.comparison.primary}
                name={`Comparison ${getMetricLabel(selectedMetrics.primary)}`}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={selectedMetrics.secondary}
                data={comparisonProcessed}
                stroke={CHART_COLORS.comparison.secondary}
                name={`Comparison ${getMetricLabel(selectedMetrics.secondary)}`}
              />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>COVID-19 Statistics</CardTitle>
        <CardDescription>
          Visualization of COVID-19 and vaccination data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Metric</label>
            <Select
              value={selectedMetrics.primary}
              onValueChange={(value: MetricKeys) =>
                setSelectedMetrics((prev) => ({ ...prev, primary: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>COVID Data</SelectLabel>
                  {Object.entries(METRIC_OPTIONS.COVID).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Vaccination Data</SelectLabel>
                  {Object.entries(METRIC_OPTIONS.VACCINATION).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Secondary Metric</label>
            <Select
              value={selectedMetrics.secondary}
              onValueChange={(value: keyof typeof METRIC_OPTIONS.VACCINATION) =>
                setSelectedMetrics((prev) => ({ ...prev, secondary: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Vaccination Data</SelectLabel>
                  {Object.entries(METRIC_OPTIONS.VACCINATION).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {renderMainChart()}
      </CardContent>
    </Card>
  )
}

export default CovidCharts

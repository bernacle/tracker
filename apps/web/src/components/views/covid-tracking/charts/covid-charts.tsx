import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartData, CovidData, CovidMetric } from '../types'

interface CovidChartsProps {
  baselineData: ChartData
  comparisonData: ChartData | null
  metric: CovidMetric
}

interface MergedDataPoint {
  date: string
  baselineValue: number
  comparisonValue: number
  baselineCountry: string
  comparisonCountry: string
}

const METRIC_LABELS: Record<CovidMetric, string> = {
  newCases: 'New Cases',
  totalCases: 'Total Cases',
  newDeaths: 'New Deaths',
  totalDeaths: 'Total Deaths',
} as const

export const CovidCharts: React.FC<CovidChartsProps> = ({
  baselineData,
  comparisonData,
  metric,
}) => {
  const processData = (data: ChartData): CovidData[] => {
    const uniqueEntries = new Map<string, CovidData>()

    if (data.covidData) {
      const covidDataValues = Object.values(
        data.covidData
      ) as unknown as CovidData[][]

      for (const countryData of covidDataValues) {
        if (Array.isArray(countryData)) {
          for (const entry of countryData) {
            uniqueEntries.set(entry.date, entry)
          }
        }
      }
    }

    return Array.from(uniqueEntries.values())
  }

  const mergeDataByDate = (
    baseline: CovidData[],
    baselineCountry: string,
    comparison: CovidData[] | null,
    comparisonCountry: string | null
  ): MergedDataPoint[] => {
    const dateMap = new Map<string, MergedDataPoint>()

    baseline.forEach((entry) => {
      const date = entry.date
      dateMap.set(date, {
        date,
        baselineValue: entry[metric] || 0,
        baselineCountry,
        comparisonValue: 0,
        comparisonCountry: comparisonCountry || 'Unknown',
      })
    })

    if (comparison && comparison.length > 0) {
      comparison.forEach((entry) => {
        const date = entry.date
        const existingEntry = dateMap.get(date)

        if (existingEntry) {
          existingEntry.comparisonValue = entry[metric] || 0
          existingEntry.comparisonCountry = comparisonCountry || 'Unknown'
        } else {
          dateMap.set(date, {
            date,
            baselineValue: 0,
            comparisonValue: entry[metric] || 0,
            baselineCountry,
            comparisonCountry: comparisonCountry || 'Unknown',
          })
        }
      })
    }

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  const baselineCountry = baselineData.countries[0]?.name || 'Unknown'
  const comparisonCountry =
    comparisonData?.countries[0]?.name || 'Comparison Not Selected'

  const baselineProcessed = processData(baselineData)
  const comparisonProcessed = comparisonData
    ? processData(comparisonData)
    : null

  const mergedData = mergeDataByDate(
    baselineProcessed,
    baselineCountry,
    comparisonProcessed,
    comparisonCountry
  )

  const hasData = mergedData.some(
    (entry) => entry.baselineValue > 0 || entry.comparisonValue > 0
  )

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No data available to display.
      </div>
    )
  }

  const getMetricLabel = (metric: CovidMetric): string => {
    return METRIC_LABELS[metric]
  }

  return (
    <Card className="w-full border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{getMetricLabel(metric)}</span>
          <div className="text-sm font-normal text-muted-foreground">
            {baselineData.countries[0]?.name} {comparisonData && 'vs'}{' '}
            {comparisonData?.countries[0]?.name}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={mergedData}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            >
              <defs>
                <linearGradient
                  id="baselineGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="comparisonGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
                opacity={0.2}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                }
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
                minTickGap={50}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />

              <YAxis
                allowDecimals={false}
                domain={[0, 'auto']}
                tickFormatter={(value) =>
                  Intl.NumberFormat('en-US', { notation: 'compact' }).format(
                    value
                  )
                }
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
                formatter={(value: number, name: string) => {
                  const displayName =
                    name === 'baselineValue'
                      ? baselineData.countries[0]?.name
                      : comparisonData?.countries[0]?.name
                  return [Intl.NumberFormat('en-US').format(value), displayName]
                }}
                labelFormatter={(label: string) =>
                  new Date(label).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />

              <Legend
                formatter={(value) => {
                  return value === 'baselineValue'
                    ? baselineData.countries[0]?.name
                    : comparisonData?.countries[0]?.name
                }}
                wrapperStyle={{ color: 'hsl(var(--foreground))' }}
              />

              <Area
                type="monotone"
                dataKey="baselineValue"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#baselineGradient)"
                name="baselineValue"
                connectNulls
                dot={false}
              />

              {comparisonData && (
                <Area
                  type="monotone"
                  dataKey="comparisonValue"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  fill="url(#comparisonGradient)"
                  name="comparisonValue"
                  connectNulls
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

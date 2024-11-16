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
import type { ChartData, VaccinationData, VaccinationMetric } from '../types'

interface VaccinationChartProps {
  baselineData: ChartData
  comparisonData: ChartData | null
  metric: VaccinationMetric
}

const METRIC_LABELS: Record<VaccinationMetric, string> = {
  totalVaccinations: 'Total Vaccinations',
  peopleVaccinated: 'People Vaccinated',
  peopleFullyVaccinated: 'People Fully Vaccinated',
  totalBoosters: 'Total Boosters',
  dailyVaccinations: 'Daily Vaccinations',
  peopleUnvaccinated: 'People Unvaccinated',
} as const

interface MergedDataPoint {
  date: string
  baselineValue: number
  comparisonValue: number
  baselineCountry: string
  comparisonCountry: string
}

const getMetricLabel = (metric: VaccinationMetric): string => {
  return METRIC_LABELS[metric]
}

export const VaccinationChart: React.FC<VaccinationChartProps> = ({
  baselineData,
  comparisonData,
  metric,
}) => {
  const processData = (data: ChartData) => {
    const countryMap = new Map(
      data.countries.map((country) => [country.id, country.name])
    )

    const dateMap = new Map<string, MergedDataPoint>()

    Object.entries(data.vaccinationData || {}).forEach(
      ([countryId, entries]) => {
        const countryName = countryMap.get(countryId) || 'Unknown'
        ;(entries as unknown as VaccinationData[]).forEach((entry) => {
          const existingEntry = dateMap.get(entry.date)
          const value = entry[metric] || 0

          if (existingEntry) {
            existingEntry.baselineValue = value
            existingEntry.baselineCountry = countryName
          } else {
            dateMap.set(entry.date, {
              date: entry.date,
              baselineValue: value,
              comparisonValue: 0,
              baselineCountry: countryName,
              comparisonCountry: 'Unknown',
            })
          }
        })
      }
    )

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  const baselineProcessed = processData(baselineData)
  let mergedData = baselineProcessed

  if (comparisonData) {
    const comparisonProcessed = processData(comparisonData)
    comparisonProcessed.forEach((comparisonEntry) => {
      const matchingEntry = mergedData.find(
        (entry) => entry.date === comparisonEntry.date
      )
      if (matchingEntry) {
        matchingEntry.comparisonValue = comparisonEntry.baselineValue
        matchingEntry.comparisonCountry = comparisonEntry.baselineCountry
      } else {
        mergedData.push({
          date: comparisonEntry.date,
          baselineValue: 0,
          comparisonValue: comparisonEntry.baselineValue,
          baselineCountry: baselineProcessed[0]?.baselineCountry || 'Unknown',
          comparisonCountry: comparisonEntry.baselineCountry,
        })
      }
    })
    mergedData = mergedData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  const hasData = mergedData.some(
    (entry) => entry.baselineValue > 0 || entry.comparisonValue > 0
  )

  if (!hasData) {
    return (
      <Card className="w-full border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <CardContent>
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            No data available to display.
          </div>
        </CardContent>
      </Card>
    )
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

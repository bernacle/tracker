import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Country, DemographicsMetric } from '../types'

type CountryChartProps = {
  baselineCountries: Country[]
  comparisonCountries?: Country[]
  metric: DemographicsMetric
}

type ProcessedDataPoint = {
  name: string
  baselineValue: number
  comparisonValue: number
}

const snakeToCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

const getMetricKey = (metric: string): string => snakeToCamelCase(metric)

const ensureNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

const getMetricLabel = (metric: string): string => {
  return metric
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const CountryChart: React.FC<CountryChartProps> = ({
  baselineCountries,
  comparisonCountries = [],
  metric,
}) => {
  const metricKey = getMetricKey(metric)
  const processedData: ProcessedDataPoint[] = baselineCountries.map(
    (baselineCountry) => {
      const comparisonCountry = comparisonCountries.find(
        (comp) => comp.name === baselineCountry.name
      )
      return {
        name: baselineCountry.name,
        baselineValue: ensureNumber(
          baselineCountry[metricKey as keyof Country]
        ),
        comparisonValue: comparisonCountry
          ? ensureNumber(comparisonCountry[metricKey as keyof Country])
          : 0,
      }
    }
  )

  comparisonCountries.forEach((comparisonCountry) => {
    if (!processedData.some((entry) => entry.name === comparisonCountry.name)) {
      processedData.push({
        name: comparisonCountry.name,
        baselineValue: 0,
        comparisonValue: ensureNumber(
          comparisonCountry[metricKey as keyof Country]
        ),
      })
    }
  })

  const hasData = processedData.some(
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
            {baselineCountries[0]?.name}{' '}
            {comparisonCountries.length > 0 && 'vs'}{' '}
            {comparisonCountries[0]?.name}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={processedData}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            >
              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
                opacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="name"
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
                formatter={(value: number) =>
                  Intl.NumberFormat('en-US').format(value)
                }
                labelFormatter={(label: string) => label}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
              <Bar
                dataKey="baselineValue"
                fill="hsl(var(--chart-1))"
                name={baselineCountries[0]?.name}
                barSize={20}
              />
              {comparisonCountries.length > 0 && (
                <Bar
                  dataKey="comparisonValue"
                  fill="hsl(var(--chart-2))"
                  name={comparisonCountries[0]?.name}
                  barSize={20}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

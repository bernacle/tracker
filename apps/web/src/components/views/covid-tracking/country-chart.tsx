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
import type { Country, DemographicsMetric } from './types'

interface CountryChartProps {
  baselineCountries: Country[]
  comparisonCountries?: Country[]
  metric: DemographicsMetric
}

interface ProcessedDataPoint {
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
      <div className="flex h-64 items-center justify-center text-gray-500">
        No data available to display.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          allowDecimals={false}
          domain={[0, 'auto']}
          tickFormatter={(value) =>
            Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
          }
        />
        <Tooltip
          formatter={(value: number) =>
            Intl.NumberFormat('en-US').format(value)
          }
          labelFormatter={(label: string) => label}
        />
        <Legend />
        <Bar
          dataKey="baselineValue"
          fill="#8884d8"
          name={`Baseline: ${metric}`}
          barSize={20}
        />
        <Bar
          dataKey="comparisonValue"
          fill="#82ca9d"
          name={`Comparison: ${metric}`}
          barSize={20}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

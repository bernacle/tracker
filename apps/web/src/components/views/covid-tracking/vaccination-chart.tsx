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
import type { ChartData, VaccinationData, VaccinationMetric } from './types'

interface VaccinationChartProps {
  baselineData: ChartData
  comparisonData: ChartData | null
  metric: VaccinationMetric
}

export const VaccinationChart: React.FC<VaccinationChartProps> = ({
  baselineData,
  comparisonData,
  metric,
}) => {
  const limitData = <T,>(data: T[], limit: number): T[] => {
    return data.slice(-limit)
  }

  const processData = (data: ChartData) => {
    const countryMap = new Map(
      data.countries.map((country) => [country.id, country.name])
    )

    const flattenedVaccinationData = Object.entries(
      data.vaccinationData || {}
    ).flatMap(([countryId, vaccinationEntries]) => {
      const limitedVaccinationEntries = limitData(
        vaccinationEntries as unknown as VaccinationData[],
        10
      )

      return limitedVaccinationEntries.map((entry) => ({
        date: entry.date,
        countryName: countryMap.get(countryId) || 'Unknown',
        value: entry[metric] || 0,
      }))
    })

    return flattenedVaccinationData
  }

  const baselineProcessed = processData(baselineData)
  const comparisonProcessed = comparisonData ? processData(comparisonData) : []

  const combinedData = [...baselineProcessed, ...comparisonProcessed]

  const hasData = combinedData.some((entry) => entry.value > 0)

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No data available to display.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) =>
            new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          }
        />
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
          labelFormatter={(label: string) =>
            new Date(label).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          }
        />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name={`Baseline ${metric}`} />
        {comparisonProcessed.length > 0 && (
          <Bar dataKey="value" fill="#82ca9d" name={`Comparison ${metric}`} />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

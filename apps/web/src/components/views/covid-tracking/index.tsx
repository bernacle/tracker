'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { fetchCountries } from '@/http/requests/fetch-countries'
import { fetchData } from '@/http/requests/graph'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ComparisonForm } from './comparison-form'
import { CountryChart } from './country-chart'
import { CovidCharts } from './covid-charts'
import type {
  Category,
  ChartData,
  ComparisonData,
  Country,
  CovidMetric,
  DemographicsMetric,
  GraphRequest,
  Metric,
  VaccinationMetric,
} from './types'
import { VaccinationChart } from './vaccination-chart'

export default function CovidTracking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [baselineData, setBaselineData] = useState<ChartData | null>(null)
  const [comparisonData, setComparisonData] = useState<ChartData | null>(null)
  const [metric, setMetric] = useState<Metric>('newCases')
  const [category, setCategory] = useState<Category>('COVID')

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetchCountries()
        setCountries(response.countries)
      } catch (err) {
        setError('Failed to load countries')
      }
    }

    loadCountries()
  }, [])

  const handleComparisonSubmit = async (data: ComparisonData) => {
    setLoading(true)
    setError(null)

    setMetric(data.metric as Metric)
    setCategory(data.category as Category)

    const baselineCountryIsoCode = countries.find(
      (country) => country.id === data.baselineCountry
    )?.isoCode

    if (!baselineCountryIsoCode) {
      throw new Error('Baseline country not found')
    }

    const comparisonCountryIsoCode = data.comparisonCountry
      ? countries.find((country) => country.id === data.comparisonCountry)
          ?.isoCode
      : undefined

    const request: GraphRequest = {
      baseline: {
        countries: [baselineCountryIsoCode],
        category: data.category,
        metric: data.metric,
      },
      ...(comparisonCountryIsoCode
        ? {
            comparison: {
              countries: [comparisonCountryIsoCode],
              category: data.category,
              metric: data.metric,
            },
          }
        : {}),

      ...(data.dateRange && {
        dateRange: {
          startDate: data.dateRange.startDate.toISOString(),
          endDate: data.dateRange.endDate.toISOString(),
        },
      }),
    }

    try {
      const responseData = await fetchData(request)
      setBaselineData(responseData.baseline)
      setComparisonData(responseData.comparison || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <ComparisonForm
        onSubmit={handleComparisonSubmit}
        availableCountries={countries}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {category === 'COVID' && baselineData && (
        <CovidCharts
          baselineData={baselineData}
          comparisonData={comparisonData}
          metric={metric as CovidMetric}
        />
      )}

      {category === 'DEMOGRAPHICS' && baselineData && (
        <CountryChart
          baselineCountries={baselineData.countries}
          comparisonCountries={comparisonData?.countries || []}
          metric={metric as DemographicsMetric}
        />
      )}

      {category === 'VACCINATION' && baselineData && (
        <VaccinationChart
          baselineData={baselineData}
          comparisonData={comparisonData}
          metric={metric as VaccinationMetric}
        />
      )}
    </div>
  )
}

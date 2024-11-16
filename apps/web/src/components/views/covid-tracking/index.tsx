'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { fetchCountries } from '@/http/requests/fetch-countries'
import { fetchData } from '@/http/requests/graph'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ComparisonForm } from './comparison-form'
import { CovidCharts } from './covid-charts'
import type { ChartData, ComparisonData, Country } from './types'

export default function CovidTracking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [baselineData, setBaselineData] = useState<ChartData | null>(null)
  const [comparisonData, setComparisonData] = useState<ChartData | null>(null)

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const { countries } = await fetchCountries()
        setCountries(countries)
      } catch (err) {
        setError('Failed to load countries')
      }
    }
    loadCountries()
  }, [])

  const handleComparisonSubmit = async (data: ComparisonData) => {
    setLoading(true)
    setError(null)

    const request = {
      baseline: {
        countries: [data.baselineCountry],
      },
      comparison: {
        countries: [data.comparisonCountry],
      },
      dateRange: data.dateRange
        ? {
            startDate: data.dateRange.startDate.toISOString(),
            endDate: data.dateRange.endDate.toISOString(),
          }
        : {
            startDate: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            endDate: new Date().toISOString(),
          },
    }

    try {
      const responseData = await fetchData(request)
      setBaselineData(responseData.baseline)
      setComparisonData(responseData.comparison)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  // The rest of your component remains the same
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

      {baselineData && (
        <CovidCharts
          baselineData={baselineData}
          comparisonData={comparisonData}
        />
      )}
    </div>
  )
}

'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { fetchCountries, type Country } from '@/http/requests/fetch-countries'
import { fetchData } from '@/http/requests/graph'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CovidCharts } from './covid-charts'
import { DemographicsForm } from './demographics-form'
import type { CovidData, DataSection, GraphRequest } from './types'

const DEFAULT_DATE_RANGE = {
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date().toISOString(),
}

export default function CovidTracking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<Array<Country>>([])
  const [baselineData, setBaselineData] = useState<CovidData[]>([])
  const [comparisonData, setComparisonData] = useState<CovidData[]>([])
  const [request, setRequest] = useState<GraphRequest>({
    baseline: {
      countries: [],
      demographics: {},
    },
    dateRange: DEFAULT_DATE_RANGE,
  })

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

  const handleBaselineSubmit = (data: DataSection) => {
    setRequest((prev) => ({
      ...prev,
      baseline: data,
    }))
  }

  const handleComparisonSubmit = (data: DataSection) => {
    setRequest((prev) => ({
      ...prev,
      comparison: data,
    }))
  }

  const toggleComparison = () => {
    setRequest((prev) => ({
      ...prev,
      comparison: prev.comparison
        ? undefined
        : { countries: [], demographics: {} },
    }))
    setComparisonData([])
  }

  const handleFetchData = async () => {
    if (request.baseline.countries.length === 0) {
      setError('Please select at least one country for baseline data')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchData(request)
      setBaselineData(data.baseline)
      setComparisonData(data.comparison || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DemographicsForm
          onSubmit={handleBaselineSubmit}
          availableCountries={countries}
          defaultValues={request.baseline}
        />

        <div className="space-y-4">
          <Button
            onClick={toggleComparison}
            variant="outline"
            className="w-full"
          >
            {request.comparison ? 'Remove Comparison' : 'Add Comparison'}
          </Button>

          {request.comparison && (
            <DemographicsForm
              onSubmit={handleComparisonSubmit}
              isComparison
              availableCountries={countries}
              defaultValues={request.comparison}
            />
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleFetchData}
          disabled={loading || request.baseline.countries.length === 0}
          className="w-full md:w-auto"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Fetch Data
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(baselineData.length > 0 || comparisonData.length > 0) && (
        <CovidCharts
          baselineData={baselineData}
          comparisonData={comparisonData}
        />
      )}
    </div>
  )
}

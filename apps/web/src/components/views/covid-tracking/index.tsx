'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { CovidCharts } from './covid-charts'
import { DemographicsForm } from './demographics-form'
import type { Demographics, GraphRequest } from './types'

const DEFAULT_DATE_RANGE = {
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date().toISOString(),
}

export default function CovidTracking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [baselineData, setBaselineData] = useState([])
  const [comparisonData, setComparisonData] = useState([])
  const [request, setRequest] = useState<GraphRequest>({
    baseline: {},
    dateRange: DEFAULT_DATE_RANGE,
  })

  const handleBaselineDemographics = (demographics: Demographics) => {
    setRequest((prev) => ({
      ...prev,
      baseline: { ...prev.baseline, demographics },
    }))
  }

  const handleComparisonDemographics = (demographics: Demographics) => {
    setRequest((prev) => ({
      ...prev,
      comparison: { demographics },
    }))
  }

  const handleFetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/covid-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()
      setBaselineData(data.baseline)
      setComparisonData(data.comparison || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const toggleComparison = () => {
    setRequest((prev) => ({
      ...prev,
      comparison: prev.comparison ? undefined : {},
    }))
    setComparisonData([])
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DemographicsForm
          onSubmit={handleBaselineDemographics}
          isComparison={false}
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
              onSubmit={handleComparisonDemographics}
              isComparison={true}
            />
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleFetchData}
          disabled={loading}
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

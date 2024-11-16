'use client'

import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { fetchCountries } from '@/http/requests/fetch-countries'
import { fetchData } from '@/http/requests/graph'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CountryChart } from './charts/country-chart'
import { CovidCharts } from './charts/covid-charts'
import { VaccinationChart } from './charts/vaccination-chart'
import { ComparisonForm } from './comparison-form'
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
        toast({
          title: 'Error',
          description: 'Failed to load countries',
        })
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
      toast({
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Failed to fetch data',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="h-full">
          <Card className="h-full border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardContent className="p-6">
              <ComparisonForm
                onSubmit={handleComparisonSubmit}
                availableCountries={countries}
              />
            </CardContent>
          </Card>
        </div>

        <div className="relative h-full">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

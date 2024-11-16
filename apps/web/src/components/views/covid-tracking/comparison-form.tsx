'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

const METRIC_CATEGORIES = {
  DEMOGRAPHICS: 'Demographics',
  COVID: 'COVID Data',
  VACCINATION: 'Vaccination Data',
} as const

const METRICS = {
  DEMOGRAPHICS: {
    income_group: 'Income Group',
    population_density: 'Population Density',
    median_age: 'Median Age',
    gdp_per_capita: 'GDP per Capita',
    cardiovasc_death_rate: 'Cardiovascular Death Rate',
    diabetes_prevalence: 'Diabetes Prevalence',
    female_smokers: 'Female Smokers %',
    male_smokers: 'Male Smokers %',
    hospital_beds_per_thousand: 'Hospital Beds per 1000',
    human_development_index: 'Human Development Index',
  },
  COVID: {
    newCases: 'New Cases',
    totalCases: 'Total Cases',
    newDeaths: 'New Deaths',
    totalDeaths: 'Total Deaths',
  },
  VACCINATION: {
    totalVaccinationsPerHundred: 'Total Vaccinations per 100 people',
    peopleVaccinatedPerHundred: 'People with at least one dose per 100',
    peopleFullyVaccinatedPerHundred: 'Fully vaccinated people per 100',
    totalBoostersPerHundred: 'Boosters per 100 people',
    dailyVaccinationsSmoothed: 'Daily Vaccinations (7-day avg)',
    dailyVaccinationsSmoothedPerMillion:
      'Daily Vaccinations per million (7-day avg)',
  },
} as const

interface Country {
  id: string
  name: string
}

interface ComparisonData {
  baselineCountry: string
  comparisonCountry?: string
  category: keyof typeof METRIC_CATEGORIES
  metric: string
  dateRange?: {
    startDate: Date
    endDate: Date
  }
}

interface ComparisonFormProps {
  onSubmit: (data: ComparisonData) => void
  availableCountries: Country[]
}

export function ComparisonForm({
  onSubmit,
  availableCountries,
}: ComparisonFormProps) {
  const [baselineCountry, setBaselineCountry] = useState<string>('')
  const [comparisonCountry, setComparisonCountry] = useState<
    string | undefined
  >(undefined)
  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof METRIC_CATEGORIES | ''
  >('')
  const [selectedMetric, setSelectedMetric] = useState<string>('')
  const [dateRange, setDateRange] = useState<{
    startDate: Date | undefined
    endDate: Date | undefined
  }>({
    startDate: undefined,
    endDate: undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      baselineCountry,
      ...(comparisonCountry ? { comparisonCountry } : {}),
      category: selectedCategory as keyof typeof METRIC_CATEGORIES,
      metric: selectedMetric,
      ...(dateRange.startDate && dateRange.endDate
        ? {
            dateRange: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            },
          }
        : {}),
    })
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Compare Countries</CardTitle>
        <p className="mt-2 text-muted-foreground">
          Select countries and data to visualize or compare
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">First Country</Label>
              <Select
                value={baselineCountry}
                onValueChange={setBaselineCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select first country" />
                </SelectTrigger>
                <SelectContent>
                  {availableCountries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Second Country (Optional)
              </Label>
              <Select
                value={comparisonCountry}
                onValueChange={setComparisonCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select second country" />
                </SelectTrigger>
                <SelectContent>
                  {availableCountries
                    .filter((country) => country.id !== baselineCountry)
                    .map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">What to Compare</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value: keyof typeof METRIC_CATEGORIES) => {
                setSelectedCategory(value)
                setSelectedMetric('')
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select data category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(METRIC_CATEGORIES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && selectedCategory !== 'DEMOGRAPHICS' && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Date Range (Optional)
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange.startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.startDate ? (
                        format(dateRange.startDate, 'PPP')
                      ) : (
                        <span>Start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    avoidCollisions={false}
                  >
                    <Calendar
                      mode="single"
                      selected={dateRange.startDate}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, startDate: date }))
                      }
                      defaultMonth={new Date(2019, 11)}
                      fromYear={2019}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange.endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.endDate ? (
                        format(dateRange.endDate, 'PPP')
                      ) : (
                        <span>End date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    avoidCollisions={false}
                  >
                    <Calendar
                      mode="single"
                      selected={dateRange.endDate}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, endDate: date }))
                      }
                      defaultMonth={new Date()}
                      fromYear={2019}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {selectedCategory && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Specific Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(METRICS[selectedCategory]).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!baselineCountry || !selectedCategory || !selectedMetric}
          >
            Compare Data
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

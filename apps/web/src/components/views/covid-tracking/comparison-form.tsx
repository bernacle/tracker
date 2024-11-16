'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Calendar as CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'

const METRIC_CATEGORIES = {
  DEMOGRAPHICS: 'DEMOGRAPHICS',
  COVID: 'COVID',
  VACCINATION: 'VACCINATION',
} as const

const DEMOGRAPHICS = {
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
} as const

const COVID_METRICS = {
  newCases: 'New Cases',
  totalCases: 'Total Cases',
  newDeaths: 'New Deaths',
  totalDeaths: 'Total Deaths',
} as const

const VACCINATION_METRICS = {
  totalVaccinationsPerHundred: 'Total Vaccinations per 100 people',
  peopleVaccinatedPerHundred: 'People with at least one dose per 100',
  peopleFullyVaccinatedPerHundred: 'Fully vaccinated people per 100',
  totalBoostersPerHundred: 'Boosters per 100 people',
  dailyVaccinationsSmoothed: 'Daily Vaccinations (7-day avg)',
  dailyVaccinationsSmoothedPerMillion:
    'Daily Vaccinations per million (7-day avg)',
} as const

interface Country {
  id: string
  name: string
}

interface ComparisonData {
  baselineCountry: string
  comparisonCountry: string
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
  const [comparisonCountry, setComparisonCountry] = useState<string>('')
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
    if (
      !baselineCountry ||
      !comparisonCountry ||
      !selectedCategory ||
      !selectedMetric
    )
      return

    const needsDateRange = selectedCategory !== 'DEMOGRAPHICS'
    if (needsDateRange && (!dateRange.startDate || !dateRange.endDate)) return

    onSubmit({
      baselineCountry,
      comparisonCountry,
      category: selectedCategory as keyof typeof METRIC_CATEGORIES,
      metric: selectedMetric,
      ...(needsDateRange && dateRange.startDate && dateRange.endDate
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
    <Card>
      <CardHeader>
        <CardTitle>Compare Countries</CardTitle>
        <CardDescription>
          Select two countries and what data you want to compare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Country Selection */}
          <div className="space-y-2">
            <Label>First Country</Label>
            <Select value={baselineCountry} onValueChange={setBaselineCountry}>
              <SelectTrigger>
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

          {/* Second Country Selection */}
          {baselineCountry && (
            <div className="space-y-2">
              <Label>Second Country</Label>
              <Select
                value={comparisonCountry}
                onValueChange={setComparisonCountry}
              >
                <SelectTrigger>
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
          )}

          {/* Category Selection */}
          {comparisonCountry && (
            <div className="space-y-2">
              <Label>What to Compare</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value: keyof typeof METRIC_CATEGORIES) => {
                  setSelectedCategory(value)
                  setSelectedMetric('')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={METRIC_CATEGORIES.DEMOGRAPHICS}>
                    Demographics
                  </SelectItem>
                  <SelectItem value={METRIC_CATEGORIES.COVID}>
                    COVID Data
                  </SelectItem>
                  <SelectItem value={METRIC_CATEGORIES.VACCINATION}>
                    Vaccination Data
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Metric Selection */}
          {selectedCategory && (
            <div className="space-y-2">
              <Label>Specific Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory === METRIC_CATEGORIES.DEMOGRAPHICS &&
                    Object.entries(DEMOGRAPHICS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  {selectedCategory === METRIC_CATEGORIES.COVID &&
                    Object.entries(COVID_METRICS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  {selectedCategory === METRIC_CATEGORIES.VACCINATION &&
                    Object.entries(VACCINATION_METRICS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Range (only for COVID and Vaccination) */}
          {selectedCategory &&
            selectedCategory !== METRIC_CATEGORIES.DEMOGRAPHICS && (
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex space-x-2">
                  <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !dateRange.startDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.startDate ? (
                            format(dateRange.startDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.startDate}
                          onSelect={(date) =>
                            setDateRange((prev) => ({
                              ...prev,
                              startDate: date,
                            }))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !dateRange.endDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.endDate ? (
                            format(dateRange.endDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.endDate}
                          onSelect={(date) =>
                            setDateRange((prev) => ({ ...prev, endDate: date }))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

          <Button
            type="submit"
            disabled={
              !baselineCountry ||
              !comparisonCountry ||
              !selectedCategory ||
              !selectedMetric ||
              (selectedCategory !== METRIC_CATEGORIES.DEMOGRAPHICS &&
                (!dateRange.startDate || !dateRange.endDate))
            }
          >
            Compare
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { METRICS, METRIC_CATEGORIES } from './constants'

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
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Compare Countries
        </h2>
        <p className="text-sm text-muted-foreground">
          Select countries and data to visualize or compare
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
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

          <div className="space-y-2">
            <Label>Second Country (Optional)</Label>
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
        </div>

        <div className="space-y-4">
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
                {Object.entries(METRIC_CATEGORIES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && selectedCategory !== 'DEMOGRAPHICS' && (
            <div className="space-y-2">
              <Label>Date Range (Optional)</Label>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.startDate}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, startDate: date }))
                      }
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.endDate}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, endDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {selectedCategory && (
            <div className="space-y-2">
              <Label>Specific Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
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
        </div>

        <Button
          type="submit"
          variant="ghost"
          className="to-bg-[#1a1b1e] w-full bg-gradient-to-r from-indigo-500 shadow-sm shadow-zinc-950"
          disabled={!baselineCountry || !selectedCategory || !selectedMetric}
        >
          Compare Data
        </Button>
      </form>
    </div>
  )
}

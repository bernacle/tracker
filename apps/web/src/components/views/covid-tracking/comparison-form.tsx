'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
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
import { getSearches } from '@/http/requests/get-searches'
import { saveSearch } from '@/http/requests/save-search'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { SavedSearchesModal } from '../saved-searches-modal'
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

interface SavedSearch {
  id: string
  name: string
  criteria: string
}

interface ComparisonFormProps {
  onSubmit: (data: ComparisonData) => void
  availableCountries: Country[]
}

export function ComparisonForm({
  onSubmit,
  availableCountries,
}: ComparisonFormProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    startDate: new Date('2019-12-01'),
    endDate: new Date(),
  })
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    async function fetchSavedSearches() {
      const response = await getSearches()
      setSavedSearches(response.searches)
    }

    fetchSavedSearches()
  }, [])

  const handleSavedSearchSelect = (search: SavedSearch) => {
    const criteria = JSON.parse(search.criteria)

    resetStates()

    setTimeout(() => {
      setBaselineCountry(criteria.baselineCountry || '')
      setComparisonCountry(criteria.comparisonCountry || undefined)
      setSelectedCategory(criteria.category || '')
      setSelectedMetric(criteria.metric || '')
      setDateRange({
        startDate: criteria.dateRange?.startDate
          ? new Date(criteria.dateRange.startDate)
          : undefined,
        endDate: criteria.dateRange?.endDate
          ? new Date(criteria.dateRange.endDate)
          : undefined,
      })
    }, 0)
  }

  const resetStates = () => {
    setSearchName('')
    setBaselineCountry('')
    setComparisonCountry(undefined)
    setSelectedCategory('')
    setSelectedMetric('')
    setDateRange({ startDate: undefined, endDate: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const criteria = JSON.stringify({
      baselineCountry,
      comparisonCountry,
      category: selectedCategory,
      metric: selectedMetric,
      dateRange,
    })

    if (searchName) {
      try {
        await saveSearch({ name: searchName, criteria })
        const updatedSearches = await getSearches()
        setSavedSearches(updatedSearches.searches)
      } catch (error) {
        console.error('Error saving search:', error)
      }
    }

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
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Compare Countries
          </h2>
          <div className="space-y-4">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Load Searches
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Select countries and data to visualize or compare
        </p>
      </div>

      <SavedSearchesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectSearch={handleSavedSearchSelect}
        savedSearches={savedSearches}
      />

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

        {selectedMetric && (
          <div className="space-y-4">
            <Label>Date Range (Optional)</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {dateRange.startDate
                      ? format(dateRange.startDate, 'PPP')
                      : 'Start Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.startDate}
                    onSelect={(date) =>
                      setDateRange((prev) => ({ ...prev, startDate: date }))
                    }
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {dateRange.endDate
                      ? format(dateRange.endDate, 'PPP')
                      : 'End Date'}
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
        )}

        {selectedMetric && (
          <div className="space-y-2">
            <Label htmlFor="searchName">Enter a name to save your search</Label>
            <Input
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter search name"
            />
          </div>
        )}

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

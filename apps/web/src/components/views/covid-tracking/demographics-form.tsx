'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import type { DataSection, Demographics, DemographicsFormProps } from './types'

// Utility function to capitalize the first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const CONTINENTS = [
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'north_america', label: 'North America' },
  { value: 'south_america', label: 'South America' },
  { value: 'oceania', label: 'Oceania' },
]

const INCOME_GROUPS = [
  { value: 'high', label: 'High Income' },
  { value: 'upper_middle', label: 'Upper Middle Income' },
  { value: 'lower_middle', label: 'Lower Middle Income' },
  { value: 'low', label: 'Low Income' },
]

export function DemographicsForm({
  onSubmit,
  isComparison = false,
  defaultValues,
  availableCountries = [],
}: DemographicsFormProps) {
  const [formData, setFormData] = useState<DataSection>({
    countries: defaultValues?.countries || [],
    demographics: defaultValues?.demographics || {},
  })

  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues)
    }
  }, [defaultValues])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateDemographics = (field: keyof Demographics, value: any) => {
    setFormData((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [field]: value,
      },
    }))
  }

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      countries: [value], // For now single selection, we can make it multi-select later
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isComparison ? 'Comparison Selection' : 'Baseline Selection'}
        </CardTitle>
        <CardDescription>
          Select country and demographic parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            value={formData.countries[0]}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {availableCountries
                .sort((a, b) =>
                  capitalizeWords(a.name).localeCompare(capitalizeWords(b.name))
                )
                .map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {capitalizeWords(country.name)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Rest of the form remains the same */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min Population"
              value={formData.demographics?.minPopulation || ''}
              onChange={(e) =>
                updateDemographics('minPopulation', Number(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="Max Population"
              value={formData.demographics?.maxPopulation || ''}
              onChange={(e) =>
                updateDemographics('maxPopulation', Number(e.target.value))
              }
            />
          </div>

          <Select
            value={formData.demographics?.continent}
            onValueChange={(value) => updateDemographics('continent', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Continent" />
            </SelectTrigger>
            <SelectContent>
              {CONTINENTS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={formData.demographics?.incomeGroup}
            onValueChange={(value) => updateDemographics('incomeGroup', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Income Group" />
            </SelectTrigger>
            <SelectContent>
              {INCOME_GROUPS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={formData.demographics?.smokerGender}
            onValueChange={(value: 'male' | 'female') =>
              updateDemographics('smokerGender', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Smoker Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male Smokers</SelectItem>
              <SelectItem value="female">Female Smokers</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

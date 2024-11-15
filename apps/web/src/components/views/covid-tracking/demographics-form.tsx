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
import type { Demographics, DemographicsFormProps } from './types'

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
}: DemographicsFormProps) {
  const [demographics, setDemographics] = useState<Demographics>(
    defaultValues || {}
  )

  useEffect(() => {
    if (defaultValues) {
      setDemographics(defaultValues)
    }
  }, [defaultValues])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(demographics)
  }

  const updateField = (field: keyof Demographics, value: any) => {
    setDemographics((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isComparison ? 'Comparison Demographics' : 'Baseline Demographics'}
        </CardTitle>
        <CardDescription>
          Select demographic parameters for{' '}
          {isComparison ? 'comparison' : 'baseline'} data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min Population"
              value={demographics.minPopulation || ''}
              onChange={(e) =>
                updateField('minPopulation', Number(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="Max Population"
              value={demographics.maxPopulation || ''}
              onChange={(e) =>
                updateField('maxPopulation', Number(e.target.value))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min Median Age"
              value={demographics.minMedianAge || ''}
              onChange={(e) =>
                updateField('minMedianAge', Number(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="Max Median Age"
              value={demographics.maxMedianAge || ''}
              onChange={(e) =>
                updateField('maxMedianAge', Number(e.target.value))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min GDP per Capita"
              value={demographics.minGdpPerCapita || ''}
              onChange={(e) =>
                updateField('minGdpPerCapita', Number(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="Max GDP per Capita"
              value={demographics.maxGdpPerCapita || ''}
              onChange={(e) =>
                updateField('maxGdpPerCapita', Number(e.target.value))
              }
            />
          </div>

          <Select
            value={demographics.continent}
            onValueChange={(value) => updateField('continent', value)}
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
            value={demographics.incomeGroup}
            onValueChange={(value) => updateField('incomeGroup', value)}
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
            value={demographics.smokerGender}
            onValueChange={(value: 'male' | 'female') =>
              updateField('smokerGender', value)
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

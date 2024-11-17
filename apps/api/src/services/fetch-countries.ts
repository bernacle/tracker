import type { CountriesRepository } from "@/repositories/countries-repository"
import type { Country } from "@prisma/client"
import { CountriesMapper } from "./mapper/countries-mapper"

type FetchCountriesServiceResponse = {
  countries: Country[]
}

export class FetchCountriesService {
  constructor(private countriesRepository: CountriesRepository) { }

  async execute(): Promise<FetchCountriesServiceResponse> {
    const countries = await this.countriesRepository.findAll()

    const capitalizedCountries = countries.map(country => CountriesMapper.toCapitalize(country))

    return { countries: capitalizedCountries }
  }
}
import type { CountriesRepository } from "@/repositories/countries-repository"
import type { Country } from "@prisma/client"


type FetchCountriesServiceResponse = {
  countries: Country[]
}

export class FetchCountriesService {
  constructor(private countriesRepository: CountriesRepository) { }

  async execute(): Promise<FetchCountriesServiceResponse> {
    const countries = await this.countriesRepository.findAll()

    return { countries }
  }
}

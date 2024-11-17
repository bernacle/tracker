import type { Country } from "@prisma/client"


export class CountriesMapper {
  static toCapitalize(country: Country) {
    return {
      ...country,
      name: country.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }
  }
}



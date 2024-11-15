import type { DemographicFilters } from "@/services/compare-data-service";

export function normalizeDemographics(
  demographics?: Record<string, unknown>
): DemographicFilters | undefined {
  if (!demographics) return undefined;

  return {
    ...demographics,
    continent: typeof demographics.continent === "string" ? demographics.continent.toLowerCase() : undefined,
    incomeGroup: typeof demographics.incomeGroup === "string" ? demographics.incomeGroup.toLowerCase() : undefined,
    minPopulation: typeof demographics.minPopulation === "number" ? demographics.minPopulation : undefined,
    maxPopulation: typeof demographics.maxPopulation === "number" ? demographics.maxPopulation : undefined,
    minMedianAge: typeof demographics.minMedianAge === "number" ? demographics.minMedianAge : undefined,
    maxMedianAge: typeof demographics.maxMedianAge === "number" ? demographics.maxMedianAge : undefined,
    minGdpPerCapita: typeof demographics.minGdpPerCapita === "number" ? demographics.minGdpPerCapita : undefined,
    maxGdpPerCapita: typeof demographics.maxGdpPerCapita === "number" ? demographics.maxGdpPerCapita : undefined,
    smokerGender: demographics.smokerGender === "male" || demographics.smokerGender === "female" ? demographics.smokerGender : undefined,
  };
}

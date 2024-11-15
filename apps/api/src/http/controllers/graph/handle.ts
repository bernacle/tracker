import { makeComparaDataService } from "@/services/factories/make-compare-data-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { graphSchema } from "./schemas";
import { normalizeDemographics } from "./utils";

export async function handle(request: FastifyRequest, reply: FastifyReply) {
  const parsedData = graphSchema.parse(request.body);

  const normalizedData = {
    ...parsedData,
    baseline: {
      ...parsedData.baseline,
      demographics: normalizeDemographics(parsedData.baseline.demographics),
    },
    comparison: parsedData.comparison
      ? {
        ...parsedData.comparison,
        demographics: normalizeDemographics(parsedData.comparison.demographics),
      }
      : undefined,
  };

  const compareDataService = makeComparaDataService();

  const dateRange = {
    startDate: new Date(normalizedData.dateRange.startDate),
    endDate: new Date(normalizedData.dateRange.endDate),
  };

  const { baseline, comparison } = await compareDataService.execute({
    baseline: normalizedData.baseline,
    comparison: normalizedData.comparison,
    dateRange,
  });

  return reply.status(201).send({ baseline, comparison });
}

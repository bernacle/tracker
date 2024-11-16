import { makeCompareDataService } from "@/services/factories/make-compare-data-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { graphSchema } from "./schemas";

export async function data(request: FastifyRequest, reply: FastifyReply) {
  const parsedData = graphSchema.parse(request.body);

  const compareDataService = makeCompareDataService();

  const dateRange = parsedData.dateRange
    ? {
      startDate: new Date(parsedData.dateRange.startDate),
      endDate: new Date(parsedData.dateRange.endDate),
    }
    : undefined;

  const { baseline, comparison } = await compareDataService.execute({
    baseline: parsedData.baseline,
    comparison: parsedData.comparison,
    dateRange,
  });

  return reply.status(201).send({ baseline, comparison });
}

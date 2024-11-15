import { makeComparaDataService } from "@/services/factories/make-compare-data-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";




export async function handle(request: FastifyRequest, reply: FastifyReply) {
  const graphSchema = z.object({
    baseline: z.object({
      countries: z.array(z.string()).optional(), // ISO country codes
      demographics: z
        .object({
          minPopulation: z.number().optional(),
          maxPopulation: z.number().optional(),
          minMedianAge: z.number().optional(),
          maxMedianAge: z.number().optional(),
          minGdpPerCapita: z.number().optional(),
          maxGdpPerCapita: z.number().optional(),
          continent: z.string().optional(),
          incomeGroup: z.string().optional(),
          smokerGender: z.enum(["male", "female"]).optional(),
        })
        .optional(),
    }),
    comparison: z
      .object({
        countries: z.array(z.string()).optional(), // ISO country codes
        demographics: z
          .object({
            minPopulation: z.number().optional(),
            maxPopulation: z.number().optional(),
            minMedianAge: z.number().optional(),
            maxMedianAge: z.number().optional(),
            minGdpPerCapita: z.number().optional(),
            maxGdpPerCapita: z.number().optional(),
            continent: z.string().optional(),
            incomeGroup: z.string().optional(),
            smokerGender: z.enum(["male", "female"]).optional(),
          })
          .optional(),
      })
      .optional(),
    dateRange: z.object({
      startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid startDate",
      }),
      endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid endDate",
      }),
    }),
  });


  const params = graphSchema.parse(request.body)

  const compareDataService = makeComparaDataService()

  const dateRange = {
    startDate: new Date(params.dateRange.startDate),
    endDate: new Date(params.dateRange.endDate),
  };

  const { baseline, comparison } = await compareDataService.execute({
    baseline: params.baseline,
    comparison: params.comparison,
    dateRange,
  })

  return reply.status(201).send({ baseline, comparison })
}
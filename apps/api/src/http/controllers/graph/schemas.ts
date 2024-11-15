import { z } from "zod";

export const graphSchema = z.object({
  baseline: z.object({
    countries: z.array(z.string()).optional(),
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
      countries: z.array(z.string()).optional(),
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

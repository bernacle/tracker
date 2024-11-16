import { z } from "zod";

export const graphSchema = z.object({
  baseline: z.object({
    countries: z.array(z.string()).optional(),
    category: z.enum(["DEMOGRAPHICS", "COVID", "VACCINATION"]),
    metric: z.string(),
  }),
  comparison: z
    .object({
      countries: z.array(z.string()).optional(),
      category: z.enum(["DEMOGRAPHICS", "COVID", "VACCINATION"]),
      metric: z.string(),
    })
    .optional(),
  dateRange: z
    .object({
      startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid startDate",
      }),
      endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid endDate",
      }),
    })
    .optional(),
});


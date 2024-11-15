import { makeFetchCountriesService } from "@/services/factories/make-fetch-countries-service";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function getCountries(request: FastifyRequest, reply: FastifyReply) {
  const fetchCountriesService = makeFetchCountriesService();
  const { countries } = await fetchCountriesService.execute();

  return reply.status(200).send({ countries });
}

import { makeGetSearchesService } from '@/services/factories/make-get-searches-service';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getSearches(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const userId = request.user?.sub;

  try {
    const getSearchesService = makeGetSearchesService();

    const { searches } = await getSearchesService.execute({
      userId,
    });

    return reply.status(200).send({ searches });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: 'Failed to get searches' });
  }
}

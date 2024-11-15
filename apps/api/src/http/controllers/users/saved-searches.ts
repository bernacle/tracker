import { makeSaveSearchService } from '@/services/factories/make-save-search-service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function saveSearch(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const saveSearchBodySchema = z.object({
    name: z.string().optional(),
    criteria: z.string()
  });

  const { name, criteria } = saveSearchBodySchema.parse(request.body);

  const userId = request.user?.sub;

  try {
    const saveSearchService = makeSaveSearchService();

    const { savedSearch } = await saveSearchService.execute({
      name,
      criteria,
      userId,
    });

    return reply.status(201).send({ savedSearch });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: 'Failed to save search' });
  }
}
